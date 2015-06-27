/**
 * Jun 27, 2015
 * Nitin
 * 3:28:31 PM
 */
package com.beautifulyears.exceptions;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.beautifulyears.util.LoggerUtil;

@ResponseStatus(value=HttpStatus.NOT_FOUND, reason="No Discuss content found")
public class DiscussNotFound extends BYException{
	
	private static final Logger logger = Logger.getLogger(DiscussNotFound.class);
	private static final long serialVersionUID = 1L;

	public DiscussNotFound() {
		super();
		LoggerUtil.logEntry();
		logger.debug("Exception : no discuss exists");
	}

	public DiscussNotFound(String discussId) {
		logger.debug("Exception : no discuss exists with id:"+discussId);
	}

}
