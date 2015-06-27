/**
 * Jun 27, 2015
 * Nitin
 * 3:43:27 PM
 */
package com.beautifulyears.exceptions;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.beautifulyears.util.LoggerUtil;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR, reason = "Unknown internal error occured")
public class BYInternalError extends BYException {
	

	private static final long serialVersionUID = 1L;
	private static final Logger logger  = Logger.getLogger(BYInternalError.class);

	public BYInternalError() {
		super();
		LoggerUtil.logEntry();
		logger.error("Unknown internal error occured");
	}



}
