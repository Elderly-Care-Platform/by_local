package com.beautifulyears.util;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;

public class Util {

	private static final Logger logger = Logger.getLogger(Util.class);

	public static boolean isEmpty(String value) {
		return value == null || value.length() == 0;
	}

	public static User getSessionUser(HttpServletRequest req) {
		return (User) req.getSession().getAttribute("user");
	}

	public static void handleException(Exception e) throws Exception {
		if (e instanceof BYException) {
			throw e;
		} else {
			try {
				StackTraceElement currentStack = Thread.currentThread()
						.getStackTrace()[2];
				if (null != currentStack) {
					logger.error("Exception occured in " + currentStack.getClassName()
							+ "::" + currentStack.getMethodName());
				}
			} catch (Exception exception) {

			}
			throw new BYException(BYErrorCodes.INTERNAL_SERVER_ERROR);

		}
	}
	
	public static int getDiscussContentType(String discussType){
		int discussContentType = DiscussConstants.CONTENT_TYPE_DISCUSS;
		if("Q".equals(discussType)){
			discussContentType = DiscussConstants.CONTENT_TYPE_QUESTION;
		}else if("P".equals(discussType)){
			discussContentType = DiscussConstants.CONTENT_TYPE_ARTICLE;
		}else if("A".equals(discussType)){
			discussContentType = DiscussConstants.CONTENT_TYPE_POST;
		}
		return discussContentType;
	}
}
