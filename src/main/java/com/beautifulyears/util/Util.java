package com.beautifulyears.util;

import javax.servlet.http.HttpServletRequest;

import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.exceptions.BYInternalError;

public class Util {

	public static boolean isEmpty(String value) {
		return value == null || value.length() == 0;
	}
	
	public static User getSessionUser(HttpServletRequest req){
		return (User) req.getSession().getAttribute("user");
	}
	
	public static void sendGenericError() {
		throw new BYInternalError();
	}
	
	public static void handleException(Exception e) throws Exception{
		if(e instanceof BYException){
			throw e;
		}else{
			sendGenericError();
		}
	}
}
