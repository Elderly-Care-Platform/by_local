package com.beautifulyears.rest;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.DiscussConstants;
import com.beautifulyears.domain.LoginRequest;
import com.beautifulyears.domain.Session;
import com.beautifulyears.domain.User;
//import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserRolePermissions;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

/**
 * /** The REST based service for managing "users"
 * 
 * @author jumpstart
 *
 */

@Controller
@RequestMapping("/users")
public class UserController {

	private UserRepository userRepository;
	private MongoTemplate mongoTemplate;
	private static final Logger logger = Logger.getLogger(UserController.class);

	@Autowired
	public UserController(UserRepository userRepository,
			MongoTemplate mongoTemplate) {
		this.userRepository = userRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody Session login(@RequestBody LoginRequest loginRequest,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Session session = null;
		Query q = new Query();
		q.addCriteria(Criteria.where("email").is(loginRequest.getEmail())
				.and("password").is(loginRequest.getPassword()));
		try {
			if (loginRequest.getEmail().equals("admin")
					&& loginRequest.getPassword().equals("password")) {
				logger.debug("admin user logged in into the system");
				User user = new User("admin", null, null, null, null, null,
						null, null, null, null, null);
				session = createSession(req, res, user);
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
				return null;
			}
			// normal user login
			else {
				User user = mongoTemplate.findOne(q, User.class);
				if (null == user) {
					logger.debug("log in failed with userId = "
							+ loginRequest.getEmail());
					session = killSession(req, res);
//					throw new UserAuthorizationException();
				} else {
					logger.debug("user logged in into the system with userId = "
							+ user.getId()
							+ " and email  as  "
							+ user.getEmail());
					session = createSession(req, res, user);
					
				}
			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return session;

	}

	@RequestMapping(method = RequestMethod.GET, value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Session logout(
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Session session = null;
		try {
			logger.debug("logging out");
			session = killSession(req, res);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return session;
	}

	@RequestMapping(method = RequestMethod.GET, value = { "/list/all",
			"/listAll" }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<User> allUsers() {
		LoggerUtil.logEntry();
		return userRepository
				.findAll(new Sort(Sort.Direction.DESC, "createdAt"));
	}

	// create user - registration
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Session submitUser(@RequestBody User user, HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Session session = null;

		if (user == null || user.getId() == null || user.getId().equals("")) {
			try {
				Query q = new Query();
				q.addCriteria(Criteria.where("email").is(user.getEmail()));
				if (mongoTemplate.count(q, User.class) > 0) {
					logger.debug("user with the same emailId already exist = "
							+ user.getEmail());
					throw new Exception("Email already exists!");
				}
				User userWithExtractedInformation = decorateWithInformation(user);
				userRepository.save(userWithExtractedInformation);
				req.getSession().setAttribute("user",
						userWithExtractedInformation);
				session = createSession(req, res, userWithExtractedInformation);
				
			} catch (Exception e) {
				logger.error("error occured while creating the user");
				Util.handleException(e);
			}

		} else {
			System.out.println("EDIT USER");
			User editedUser = getUser(user.getId());
			editedUser.setUserName(user.getUserName());
			editedUser.setPassword(user.getPassword());
			editedUser.setSocialSignOnId(user.getSocialSignOnId());
			editedUser.setSocialSignOnPlatform(user.getSocialSignOnPlatform());
			editedUser.setPasswordCode(user.getPasswordCode());
			editedUser.setPasswordCodeExpiry(user.getPasswordCodeExpiry());
			editedUser.setUserRoleId(user.getUserRoleId());
			editedUser.setActive(user.isActive());
			userRepository.save(editedUser);
			session = createSession(req, res, editedUser);
			
		}
		return session;

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

		System.out.println("user role id = " + userRoleId);

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

	@RequestMapping(method = RequestMethod.DELETE, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<Void> deleteUser(@PathVariable("userId") String userId) {
		LoggerUtil.logEntry();
		userRepository.delete(userId);
		ResponseEntity<Void> responseEntity = new ResponseEntity<>(
				HttpStatus.CREATED);
		logger.info("user deleted with userId = " + userId);
		return responseEntity;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public User editUser(@PathVariable("userId") String userId) {
		LoggerUtil.logEntry();
		User user = userRepository.findOne(userId);
		return user;
	}

	// - getUserByVerificationCode - users/{userId}

	@RequestMapping(method = RequestMethod.GET, value = "/show/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody User showUser(@PathVariable("userId") String userId) {
		LoggerUtil.logEntry();
		User user = userRepository.findOne(userId);
		return user;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody User getUser(@PathVariable("userId") String userId) {
		LoggerUtil.logEntry();
		User user = userRepository.findOne(userId);
		return user;
	}

	private Session createSession(HttpServletRequest req,
			HttpServletResponse res, User user) {
		LoggerUtil.logEntry();
		Session session = new Session(user, req);
		this.mongoTemplate.save(session);
		req.getSession().setAttribute("session", session);
		req.getSession().setAttribute("user", user);
		return session;
	}

	private Session killSession(HttpServletRequest req, HttpServletResponse res) {
		LoggerUtil.logEntry();
		Session session = (Session) req.getSession().getAttribute("session");
		if(null != session){
			session.setStatus(DiscussConstants.SESSION_STATUS_INACTIVE);
			this.mongoTemplate.save(session);
			req.getSession().invalidate();
		}
		return null;
	}
}