package com.beautifulyears.rest;

import java.util.Date;
import java.util.List;
import java.util.UUID;

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

import com.beautifulyears.domain.LoginRequest;
import com.beautifulyears.domain.LoginResponse;
import com.beautifulyears.domain.User;
//import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserRolePermissions;
import com.beautifulyears.repository.UserRepository;
import com.beautifulyears.repository.custom.UserRepositoryCustom;

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

	@Autowired
	public UserController(UserRepository userRepository,
			UserRepositoryCustom userRepositoryCustom,
			MongoTemplate mongoTemplate) {
		this.userRepository = userRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody LoginResponse login(
			@RequestBody LoginRequest loginRequest) {
		// System.out.println("Inside LoginController login");
		// System.out.println("loginRequest = " + loginRequest);
		System.out.println("login request email = " + loginRequest.getEmail());
		System.out.println("login request password = "
				+ loginRequest.getPassword());

		Query q = new Query();
		// ??????q.addCriteria(Criteria.where("email").is(loginRequest.getEmail()).and("password").is(loginRequest.getPassword()).and("isActive").is("Active"));
		q.addCriteria(Criteria.where("email").is(loginRequest.getEmail())
				.and("password").is(loginRequest.getPassword()));

		// admin login
		if (loginRequest.getEmail().equals("admin")
				&& loginRequest.getPassword().equals("password")) {
			LoginResponse response = new LoginResponse();
			response.setSessionId(UUID.randomUUID().toString());
			response.setStatus("OK admin");
			response.setId("admin");
			response.setUserName("admin");
			return response;
		}
		// normal user login
		else {
			System.out.println("Trying to login normal user...");
			boolean exists = mongoTemplate.exists(q, User.class);
			if (!exists) {
				System.out.println("No such user exist");
				LoginResponse response = new LoginResponse();
				response.setSessionId(null);
				response.setStatus("Login failed. Please check your credentials.");
				response.setId("");
				response.setUserName("");
				return response;
			} else {
				User user = mongoTemplate.findOne(q, User.class);
				System.out.println("User exists :: userid = " + user.getId()
						+ " :: username = " + user.getUserName());
				LoginResponse response = new LoginResponse();
				response.setSessionId(UUID.randomUUID().toString());
				response.setStatus("OK other user");
				response.setId(user.getId());
				response.setUserName(user.getUserName());
				return response;
			}
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/logout/{sessionId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody LoginResponse logout(
			@PathVariable("sessionId") String sessionId) {
		try {
			System.out.println("Inside LoginController logout, session id = "
					+ sessionId);
			LoginResponse response = new LoginResponse();
			response.setSessionId(null);
			response.setStatus("");
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			LoginResponse response = new LoginResponse();
			response.setSessionId(null);
			response.setStatus("");
			return response;
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = { "/list/all",
			"/listAll" }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<User> allUsers() {
		return userRepository
				.findAll(new Sort(Sort.Direction.DESC, "createdAt"));
	}

	// create user - registration
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<String> submitUser(@RequestBody User user)
			throws Exception {
		if (user == null || user.getId() == null || user.getId().equals("")) {
			System.out.println("NEW USER");
			try {
				Query q = new Query();
				q.addCriteria(Criteria.where("email").is(user.getEmail()));
				if (userRepository.exists(q.toString())) {
					ResponseEntity<String> responseEntity = new ResponseEntity<String>(
							"Email already exists!", HttpStatus.CREATED);
					System.out.println("responseEntity = " + responseEntity);
					throw new Exception("Email already exists!");
				}
				User userWithExtractedInformation = decorateWithInformation(user);
				userRepository.save(userWithExtractedInformation);
				ResponseEntity<String> responseEntity = new ResponseEntity<String>(
						"User created successully", HttpStatus.CREATED);
				System.out.println("responseEntity = " + responseEntity);
				return responseEntity;
			} catch (Exception e) {
				e.printStackTrace();
				ResponseEntity<String> responseEntity = new ResponseEntity<String>(
						"Error while registering user!", HttpStatus.CREATED);
				System.out.println("responseEntity = " + responseEntity);
				// return responseEntity;
				throw e;
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
			ResponseEntity<String> responseEntity = new ResponseEntity<>(
					HttpStatus.CREATED);
			System.out.println("responseEntity = " + responseEntity);
			return responseEntity;
		}

	}

	private User decorateWithInformation(User user) {
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
		System.out.println("Inside DELETE user");
		userRepository.delete(userId);
		ResponseEntity<Void> responseEntity = new ResponseEntity<>(
				HttpStatus.CREATED);
		System.out.println("responseEntity = " + responseEntity);
		return responseEntity;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public User editUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return user;
	}

	// - getUserByVerificationCode - users/{userId}

	@RequestMapping(method = RequestMethod.GET, value = "/show/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody User showUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return user;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody User getUser(@PathVariable("userId") String userId) {
		User user = userRepository.findOne(userId);
		if (user == null) {
			throw new UserNotFoundException(userId);
		}
		return user;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/verify/{verificationCode}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody User verifyUser(
			@PathVariable("verificationCode") String verificationCode) {
		User user = null;
		try {
			user = userRepository.getByVerificationCode(verificationCode);
			if (user == null) {
				throw new UserNotFoundException(verificationCode);
			}
			user.setActive("Active");
			userRepository.save(user);
		} catch (Exception e) {

		}
		return user;
	}
}