package com.beautifulyears.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserProfileNotFoundException extends RuntimeException {

	public UserProfileNotFoundException(String userProfileId) {
		super(String.format("User profile with id %s not found", userProfileId));
	}
}
