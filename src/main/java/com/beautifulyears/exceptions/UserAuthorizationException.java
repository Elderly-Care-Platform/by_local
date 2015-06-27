/**
 * Jun 27, 2015
 * Nitin
 * 3:54:01 PM
 */
package com.beautifulyears.exceptions;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.beautifulyears.util.LoggerUtil;

@ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "User is not authorized to perform the specified operation.")
public class UserAuthorizationException extends BYException {

	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger
			.getLogger(BYInternalError.class);

	public UserAuthorizationException() {
		super();
		LoggerUtil.logEntry();
		logger.error("User is not authorized to perform the specified operation");

	}

}
