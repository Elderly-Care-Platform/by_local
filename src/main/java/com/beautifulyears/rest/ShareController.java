package com.beautifulyears.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.EmailInfo;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.mail.MailHandler;

@Controller
@RequestMapping("/share")
public class ShareController {
	
	private static final Logger logger = Logger
			.getLogger(ShareController.class);
	
	/**
	 * 
	 * Mail format
	 * EmailId : [name1@domain.com, name2@domain.com]
	 * Subject : "some message here"
	 * body : "text"
	 * 
	 */
	
	@RequestMapping(value = "/email", method = RequestMethod.POST)
	@ResponseBody
	public void shareWithEmail(@RequestBody EmailInfo emailParams,
			HttpServletRequest request) throws Exception {
		try {
			
			EmailInfo emailInfo = new EmailInfo();
			
			if (emailParams != null) {
				emailInfo.setEmailIds(emailParams.getEmailIds());
				emailInfo.setSubject(emailParams.getSubject());
				emailInfo.setBody(emailParams.getBody());
				shareInMail(emailInfo);
			}else {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}
			
		} catch (Exception e) {
			logger.error(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		}
	}
	
	public static void shareInMail(EmailInfo emailInfo) {
		List<String> email = emailInfo.getEmailIds();
		String subject = emailInfo.getSubject();
		String body = emailInfo.getBody();
		MailHandler.sendMultipleMail(email, subject, body);		
	}
	
}
