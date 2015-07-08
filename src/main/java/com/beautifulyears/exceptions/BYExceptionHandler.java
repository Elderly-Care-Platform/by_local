/**
 * 
 */
package com.beautifulyears.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.beautifulyears.rest.response.BYGenericResponseHandler;

/**
 * @author Nitin
 *
 */
@ControllerAdvice
public class BYExceptionHandler extends ResponseEntityExceptionHandler{
	
	@ExceptionHandler(BYException.class)
	public ResponseEntity<Object> handleCustomException(BYException e, WebRequest request) {
 
		System.out.println("Exception occured");
		
		HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        return BYGenericResponseHandler.getResponse(e);
//		return handleExceptionInternal(e, e, headers, HttpStatus.UNPROCESSABLE_ENTITY, request);
 
	}
}
