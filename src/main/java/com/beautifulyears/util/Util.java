package com.beautifulyears.util;

import javax.servlet.http.HttpServletRequest;

import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;

public class Util {

	public static boolean isEmpty(String value) {
		return value == null || value.length() == 0;
	}
	
	public static User getSessionUser(HttpServletRequest req){
		return (User) req.getSession().getAttribute("user");
	}
	
	public static void handleException(Exception e) throws Exception{
		if(e instanceof BYException){
			throw e;
		}else{
			throw new BYException(BYErrorCodes.INTERNAL_SERVER_ERROR);
		}
	}
}
