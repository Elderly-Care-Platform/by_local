package com.beautifulyears.util;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

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
}
