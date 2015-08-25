package com.beautifulyears.rest;

import java.text.MessageFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.constants.UserRolePermissions;
import com.beautifulyears.domain.LoginRequest;
import com.beautifulyears.domain.Session;
import com.beautifulyears.domain.User;
//import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.mail.MailHandler;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.social.facebook.FBConnection;
import com.beautifulyears.social.facebook.FBGraph;
import com.beautifulyears.social.google.GGConnection;
import com.beautifulyears.social.google.GGraph;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.ResourceUtil;
import com.beautifulyears.util.UserNameHandler;
import com.beautifulyears.util.Util;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * /** The REST based service for managing "users"
 * 
 * @author jumpstart
 *
 */

@Controller
@RequestMapping("/users")
public class UserController {

	private static UserRepository userRepository;
	private static MongoTemplate mongoTemplate;
	private static final Logger logger = Logger.getLogger(UserController.class);

	@Autowired
	public UserController(UserRepository userRepository,
			MongoTemplate mongoTemplate) {
		UserController.userRepository = userRepository;
		UserController.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(value = "/validateSession", method = RequestMethod.GET)
	public @ResponseBody Object validateSession(HttpServletRequest req,
			HttpServletResponse res) {
		if (null == Util.getSessionUser(req)) {
			throw new BYException(BYErrorCodes.INVALID_SESSION);
		}
		return BYGenericResponseHandler.getResponse(null);
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody Object login(@RequestBody LoginRequest loginRequest,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Session session = null;
		try {
			if (!Util.isEmpty(loginRequest.getEmail())
					&& !Util.isEmpty(loginRequest.getPassword())) {
				Query q = new Query();
				q.addCriteria(Criteria.where("email")
						.is(loginRequest.getEmail()).and("password")
						.is(loginRequest.getPassword()));

				User user = mongoTemplate.findOne(q, User.class);
				if (null == user) {
					logger.debug("User login failed with user email : "
							+ loginRequest.getEmail());
					session = killSession(req, res);
					throw new BYException(BYErrorCodes.USER_LOGIN_FAILED);
				} else {
					logger.debug("User logged in success for user email = "
							+ loginRequest.getEmail());
					session = createSession(req, res, user);
				}
			} else {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(session);

	}

	@RequestMapping(method = RequestMethod.GET, value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object logout(HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Session session = null;
		try {
			logger.debug("logging out");
			session = killSession(req, res);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(session);
	}

	// create user - registration
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Object submitUser(@RequestBody User user, HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Session session = (Session) req.getSession().getAttribute("session");

		if (user == null || user.getId() == null || user.getId().equals("")) {
			try {
				Query q = new Query();
				q.addCriteria(Criteria.where("email").is(user.getEmail()));
				if (mongoTemplate.count(q, User.class) > 0) {
					logger.debug("user with the same emailId already exist = "
							+ user.getEmail());
					throw new BYException(BYErrorCodes.USER_ALREADY_EXIST);
				}
				User userWithExtractedInformation = decorateWithInformation(user);
				userWithExtractedInformation = userRepository
						.save(userWithExtractedInformation);
				req.getSession().setAttribute("user",
						userWithExtractedInformation);
				session = createSession(req, res, userWithExtractedInformation);

			} catch (Exception e) {
				logger.error("error occured while creating the user");
				Util.handleException(e);
			}

		} else {
			logger.debug("EDIT USER");
			User sessionUser = Util.getSessionUser(req);
			if (sessionUser == null
					|| !sessionUser.getId().equals(user.getId())) {
				throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
			}
			boolean isUserNameChanged = false;
			boolean isPasswordChanged = false;
			User editedUser = getUser(user.getId());
			if (null != editedUser
					&& !editedUser.getUserName().equals(user.getUserName())) {
				isUserNameChanged = true;
				editedUser.setUserName(user.getUserName());
				logger.debug("trying changing the user name from "
						+ editedUser.getUserName() + " to "
						+ user.getUserName());
			}
			if (null != editedUser && user.getPassword() != null) {
				if (!user.getPassword().equals(editedUser.getPassword())) {
					inValidateAllSessions(user.getId());
					isPasswordChanged = true;
				}
				editedUser.setPassword(user.getPassword());
			}

			editedUser = userRepository.save(editedUser);
			if (isUserNameChanged) {
				UserNameHandler userNameHandler = new UserNameHandler(
						mongoTemplate);
				userNameHandler.setUserParams(user.getId(), user.getUserName());
				new Thread(userNameHandler).start();
			}

			if (isUserNameChanged || isPasswordChanged) {
				session = createSession(req, res, editedUser);
			}
		}
		return BYGenericResponseHandler.getResponse(session);
	}

	@RequestMapping(value = "/getFbURL", method = RequestMethod.GET)
	public @ResponseBody Object getFbURL(HttpServletRequest req) {
		LoggerUtil.logEntry();
		return BYGenericResponseHandler.getResponse(new FBConnection()
				.getFBAuthUrl(req));
	}

	@RequestMapping(value = "/fbRes", method = RequestMethod.GET)
	public @ResponseBody Object fbRes(
			@RequestParam(value = "code", required = false) String code,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		try {
			FBConnection fbConnection = new FBConnection();
			ObjectMapper mapper = new ObjectMapper();
			String accessToken = fbConnection.getAccessToken(code);
			FBGraph fbGraph = new FBGraph(accessToken);
			String graph = fbGraph.getFBGraph();
			Map<String, String> fbProfileData = fbGraph.getGraphData(graph);

			User newFbUser = null;
			Query q = new Query();
			q.addCriteria(Criteria.where("email")
					.is(fbProfileData.get("email")));

			newFbUser = mongoTemplate.findOne(q, User.class);
			if (null == newFbUser) {
				newFbUser = new User();
				newFbUser
						.setSocialSignOnPlatform(BYConstants.SOCIAL_SIGNON_PLATFORM_FACEBOOK);
				newFbUser.setSocialSignOnId(fbProfileData.get("id"));
				newFbUser.setEmail(fbProfileData.get("email"));
				newFbUser.setUserName(fbProfileData.get("displayName"));
				logger.debug("creating new social sign on user : "
						+ newFbUser.toString());
				newFbUser = userRepository
						.save(decorateWithInformation(newFbUser));
			}
			Session session = createSession(req, res, newFbUser);

			ServletOutputStream out = res.getOutputStream();
			out.println("<script>parent.window.opener.getFbData("
					+ mapper.writeValueAsString(BYGenericResponseHandler
							.getResponse(session)) + ");</script>");
			out.println("<script>window.close();</script>");
			logger.debug("returning response for fbRes");
		} catch (Exception e) {
			Util.handleException(e);
		}

		return null;
	}

	@RequestMapping(value = "/getGgURL", method = RequestMethod.GET)
	public @ResponseBody Object getGgURL(HttpServletRequest req) {
		LoggerUtil.logEntry();
		return BYGenericResponseHandler.getResponse(new GGConnection()
				.getGGAuthUrl(req));
	}

	@RequestMapping(value = "/ggRes", method = RequestMethod.GET)
	public @ResponseBody Object ggRes(
			@RequestParam(value = "code", required = false) String code,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		try {
			ObjectMapper mapper = new ObjectMapper();
			GGConnection ggConnection = new GGConnection();
			String accessToken = ggConnection.getAccessToken(code);
			GGraph gGraph = new GGraph(accessToken);
			String graph = gGraph.getGBGraph();
			Map<String, String> ggProfileData = gGraph.getGraphData(graph);

			User newGoogleUser = null;
			Query q = new Query();
			q.addCriteria(Criteria.where("email")
					.is(ggProfileData.get("email")));

			newGoogleUser = mongoTemplate.findOne(q, User.class);
			if (null == newGoogleUser) {
				newGoogleUser = new User();
				newGoogleUser
						.setSocialSignOnPlatform(BYConstants.SOCIAL_SIGNON_PLATFORM_GOOGLE);
				newGoogleUser.setSocialSignOnId(ggProfileData.get("id"));
				newGoogleUser.setEmail(ggProfileData.get("email"));
				newGoogleUser.setUserName(ggProfileData.get("displayName"));
				logger.debug("creating new social sign on user : "
						+ newGoogleUser.toString());
				newGoogleUser = userRepository
						.save(decorateWithInformation(newGoogleUser));
			}
			Session session = createSession(req, res, newGoogleUser);

			ServletOutputStream out = res.getOutputStream();
			out.println("<script>parent.window.opener.getGoogleData("
					+ mapper.writeValueAsString(BYGenericResponseHandler
							.getResponse(session)) + ");</script>");
			out.println("<script>window.close();</script>");
		} catch (Exception e) {
			Util.handleException(e);
		}
		return null;
	}

	@RequestMapping(value = "/resetPassword", method = RequestMethod.GET)
	public @ResponseBody Object getResetPasswordLink(
			@RequestParam(value = "email", required = true) String email,
			HttpServletRequest req) {
		LoggerUtil.logEntry();
		if (!Util.isEmpty(email)) {
			Query q = new Query();
			q.addCriteria(Criteria.where("email").regex(email, "i"));
			User user = mongoTemplate.findOne(q, User.class);
			if (null != user) {
				user.setVerificationCode(UUID.randomUUID().toString());
				Date t = new Date();
				user.setVerificationCodeExpiry(new Date(
						t.getTime()
								+ (BYConstants.FORGOT_PASSWORD_CODE_EXPIRY_IN_MIN * 60000)));
				boolean mailStatus = sendMailForResetPassword(user);
				if (mailStatus == false) {
					throw new BYException(BYErrorCodes.ERROR_IN_SENDING_MAIL);
				}
				mongoTemplate.save(user);
			} else {
				throw new BYException(BYErrorCodes.USER_EMAIL_DOES_NOT_EXIST);
			}
		} else {
			throw new BYException(BYErrorCodes.MISSING_PARAMETER);
		}

		return true;
	}

	@RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
	public @ResponseBody Object getResetPasswordLink(@RequestBody User user,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		User user1 = null;
		if (null != user && !Util.isEmpty(user.getVerificationCode())
				&& !Util.isEmpty(user.getPassword())) {
			Query q = new Query();
			q.addCriteria(Criteria.where("verificationCode").is(
					user.getVerificationCode()));
			user1 = mongoTemplate.findOne(q, User.class);
			if (null != user1) {
				Date currentDate = new Date();
				if (currentDate.compareTo(user1.getVerificationCodeExpiry()) <= 0) {
					user1.setVerificationCodeExpiry(currentDate);
					user1.setPassword(user.getPassword());
					logger.debug("password changed successfuully for user "
							+ user1.getEmail());
					// send mail on successful changing the password
					mongoTemplate.save(user1);
				} else {
					throw new BYException(BYErrorCodes.USER_CODE_EXPIRED);
				}
			} else {
				throw new BYException(BYErrorCodes.USER_EMAIL_DOES_NOT_EXIST);
			}
		} else {
			throw new BYException(BYErrorCodes.MISSING_PARAMETER);
		}
		inValidateAllSessions(user.getId());
		return login(new LoginRequest(user1), req, res);
	}

	@RequestMapping(value = "/verifyPwdCode", method = RequestMethod.GET)
	public @ResponseBody Object verifyPwdCode(
			@RequestParam(value = "verificationCode", required = true) String verificationCode,
			HttpServletRequest req) {
		LoggerUtil.logEntry();
		if (!Util.isEmpty(verificationCode)) {
			Query q = new Query();
			q.addCriteria(Criteria.where("verificationCode").is(
					verificationCode));
			User user1 = mongoTemplate.findOne(q, User.class);
			if (null != user1) {
				Date currentDate = new Date();
				if (currentDate.compareTo(user1.getVerificationCodeExpiry()) <= 0) {
				} else {
					throw new BYException(BYErrorCodes.USER_CODE_EXPIRED);
				}
			} else {
				throw new BYException(BYErrorCodes.USER_CODE_DOES_NOT_EXIST);
			}
		} else {
			throw new BYException(BYErrorCodes.MISSING_PARAMETER);
		}

		return true;
	}

	boolean sendMailForResetPassword(User user) {
		boolean mailStatus = false;
		try {
			ResourceUtil resourceUtil = new ResourceUtil(
					"mailTemplate.properties");
			String url = System.getProperty("path") + "#/users/resetPassword/"
					+ user.getVerificationCode();
			String userName = !Util.isEmpty(user.getUserName()) ? user
					.getUserName() : "Anonymous User";
			String body = MessageFormat.format(
					resourceUtil.getResource("resetPassword"), userName, url,
					url, url);
			MailHandler.sendMail(user.getEmail(),
					"Reset Beutifulyears' password", body);
			mailStatus = true;
		} catch (Exception e) {
			logger.error(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		}
		return mailStatus;
	}

	private User decorateWithInformation(User user) {
		LoggerUtil.logEntry();
		String userName = user.getUserName();
		String password = user.getPassword();
		String email = user.getEmail();
		String verificationCode = user.getVerificationCode();
		Date verificationCodeExpiry = user.getVerificationCodeExpiry();
		String socialSignOnId = user.getSocialSignOnId();
		String socialSignOnPlatform = user.getSocialSignOnPlatform();
		String passwordCode = user.getPassword();
		Date passwordCodeExpiry = user.getPasswordCodeExpiry();

		// Users registered through the BY site will always have ROLE = USER
		String userRoleId = "USER";

		// TODO: Change this logic during user regitration phase 2
		if (userRoleId != null
				&& (userRoleId.equals(UserRolePermissions.USER) || userRoleId
						.equals(UserRolePermissions.WRITER))) {
			return new User(userName, password, email, verificationCode,
					verificationCodeExpiry, socialSignOnId,
					socialSignOnPlatform, passwordCode, passwordCodeExpiry,
					userRoleId, "In-Active");
		} else {
			return new User(userName, password, email, verificationCode,
					verificationCodeExpiry, socialSignOnId,
					socialSignOnPlatform, passwordCode, passwordCodeExpiry,
					userRoleId, "In-Active");
		}
	}

	private Session createSession(HttpServletRequest req,
			HttpServletResponse res, User user) {
		LoggerUtil.logEntry();
		Session session = new Session(user, req);
		mongoTemplate.save(session);
		req.getSession().setAttribute("session", session);
		req.getSession().setAttribute("user", user);
		logger.debug("returning existing session for user " + user.getEmail());
		return session;
	}

	private Session killSession(HttpServletRequest req, HttpServletResponse res) {
		LoggerUtil.logEntry();
		Session session = (Session) req.getSession().getAttribute("session");
		if (null != session) {
			session.setStatus(DiscussConstants.SESSION_STATUS_INACTIVE);
			mongoTemplate.save(session);
			req.getSession().invalidate();
		}
		return null;
	}

	public static User getUser(String userId) {
		LoggerUtil.logEntry();
		User user = userRepository.findOne(userId);
		return user;
	}

	private void inValidateAllSessions(String userId) {
		List<Session> sessionList = mongoTemplate.find(new Query(Criteria
				.where("userId").is(userId)), Session.class);
		for (Session session : sessionList) {
			session.setStatus(DiscussConstants.SESSION_STATUS_INACTIVE);
			mongoTemplate.save(session);
		}
	}
}