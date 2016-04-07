package com.beautifulyears.util;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserActivityStats;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;

public class Util {

	private static final Logger logger = Logger.getLogger(Util.class);
	private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	private static UserStatsHandler stasHandler;

	public static boolean isEmpty(String value) {
		return value == null || value.trim().length() == 0;
	}

	public static User getSessionUser(HttpServletRequest req) {
		User ret = null;
		if (null != req) {
			ret = (User) req.getSession().getAttribute("user");
		}
		return ret;
	}

	public static void handleException(Exception e) throws Exception {
		if (e instanceof BYException) {
			throw e;
		} else {
			try {
				StackTraceElement currentStack = Thread.currentThread()
						.getStackTrace()[2];
				if (null != currentStack) {
					logger.error("Exception occured in "
							+ currentStack.getClassName() + "::"
							+ currentStack.getMethodName());
				}
			} catch (Exception exception) {

			}
			throw new BYException(BYErrorCodes.INTERNAL_SERVER_ERROR);

		}
	}

	public static int getDiscussContentType(String discussType) {
		int discussContentType = DiscussConstants.CONTENT_TYPE_DISCUSS;
		if ("Q".equals(discussType)) {
			discussContentType = DiscussConstants.CONTENT_TYPE_QUESTION;
		} else if ("P".equals(discussType)) {
			discussContentType = DiscussConstants.CONTENT_TYPE_POST;
		} else if ("A".equals(discussType)) {
			discussContentType = DiscussConstants.CONTENT_TYPE_POST;
		}
		return discussContentType;
	}

	public static String truncateText(String text) {
		if (text != null
				&& text.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
			text = truncateText(text,
					DiscussConstants.DISCUSS_TRUNCATION_LENGTH);
		}
		return text;
	}

	public static String truncateText(String text, int maxLength) {
		if (text != null && text.length() > maxLength) {
			int max = maxLength;
			int end = text.lastIndexOf(' ', max - 3);

			// Just one long word. Chop it off.
			if (end == -1) {
				text = text.substring(0, max - 3) + "...";
			} else {
				text = text.substring(0, end) + "...";
			}
		}
		return text;
	}

	public static String getEncodedPwd(String pwd) {
		String ret = null;
		if (!Util.isEmpty(pwd)) {
			ret = passwordEncoder.encode(pwd);
		}
		return ret;
	}

	public static boolean isPasswordMatching(String enteredPassword,
			String dbPassword) {
		boolean ret = true;
		if (Util.isEmpty(enteredPassword)) {
			throw new BYException(BYErrorCodes.USER_LOGIN_FAILED);
		}
		ret = passwordEncoder.matches(enteredPassword, dbPassword);
		if (!ret) {
			throw new BYException(BYErrorCodes.USER_LOGIN_FAILED);
		}
		return ret;
	}

	public static String getSlug(String name) {
		if (null != name) {
			org.jsoup.nodes.Document doc = Jsoup.parse(name);
			String slug = doc.text();
			int nextSpaceIndex = slug.indexOf(" ", 100);
			if (nextSpaceIndex > 1) {
				slug = slug.substring(0, nextSpaceIndex);
			}

			slug = Util.removeSpecialChars(slug);
			return slug;
		}
		return name;
	}

	public static String removeSpecialChars(String name) {
		String modifiedName = name;
		if (null != name) {
			modifiedName = name.replaceAll("[^a-zA-Z0-9 ]", "");
			modifiedName = modifiedName.replaceAll("\\s+", "-").toLowerCase();
		}
		return modifiedName;
	}

	public static void logStats(MongoTemplate mongoTemplate,
			HttpServletRequest request, String activityType, String userId,
			String userEmail, String mainEntityId, String subEntityId,
			String queryString, List<String> filterCriteria, String detail,
			String segment) {
		if (null != request && !Util.isEmpty(request.getHeader("User-Agent"))
				&& request.getHeader("User-Agent").contains("PhantomJS")) {
			return;
		}
		Util.stasHandler = new UserStatsHandler(mongoTemplate);
		UserActivityStats stats = new UserActivityStats(activityType, userId,
				userEmail, mainEntityId, subEntityId, queryString,
				filterCriteria, detail, segment);

		Util.stasHandler.setStats(stats);
		Util.stasHandler.run();
	}
}
