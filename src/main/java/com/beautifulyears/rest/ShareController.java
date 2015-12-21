package com.beautifulyears.rest;

import java.text.MessageFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.EmailInfo;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.mail.MailHandler;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.util.ResourceUtil;
import com.beautifulyears.util.Util;

@Controller
@RequestMapping("/share")
public class ShareController {
	
	private static final Logger logger = Logger
			.getLogger(ShareController.class);
	private DiscussRepository discussRepository;
	
	@Autowired
	public ShareController(
			DiscussRepository discussRepository) {
		this.discussRepository = discussRepository;

	}
	
	/**
	 * 
	 * Mail format
	 * EmailId : [name1@domain.com, name2@domain.com]
	 * Subject : "some message here"
	 * body : "text"
	 * 
	 */
	
	@RequestMapping(value = "/email/{discussId}", method = RequestMethod.POST)
	@ResponseBody
	public void shareWithEmail(@RequestBody EmailInfo emailParams,
			@PathVariable("discussId") String discussId,
			HttpServletRequest request) throws Exception {
		
		EmailInfo emailInfo = new EmailInfo();	
		ResourceUtil resourceUtil = new ResourceUtil(
				"mailTemplate.properties");
		User currentUser = Util.getSessionUser(request);
		String senderName = null;
		String profileImage = null;	
		String title = null;
		String storyImage = null;
		String borderStart = null;
		String borderEnd = null;
		String description = null;
		
		try {
			
			Discuss discuss = discussRepository.findOne(discussId);
			
			if(null == emailParams.getSenderName()){
				senderName = currentUser.getUserName();
			}else{
				senderName = emailParams.getSenderName();
			}
			
			String shareMessage = emailParams.getSubject();
			
			if(null != discuss.getUserProfile()){
				if(null == discuss.getUserProfile().getBasicProfileInfo().getProfileImage().get("original")){
					profileImage = "http://beautifulyears.com/" + discuss.getUserProfile().getBasicProfileInfo().getProfileImage().get("thumbnailImage");
				}else{
					profileImage = "http://beautifulyears.com/" + discuss.getUserProfile().getBasicProfileInfo().getProfileImage().get("original");
				}
			}else{
				profileImage = "http://beautifulyears.com/assets/img/by.png";
			}
			
			String userName = discuss.getUsername();
			
			Date dateStart = discuss.getCreatedAt();
			Date dateToday = new Date(); 
			
			long diff = dateToday.getTime()-dateStart.getTime();
			long dateDiff = diff / (24 * 60 * 60 * 1000)+1;
			
			if(null == discuss.getLinkInfo()){
				title = discuss.getTitle();
			}else{
				title = discuss.getLinkInfo().getTitle();
			}
			
			
			if(null != discuss.getLinkInfo()){
				storyImage = discuss.getLinkInfo().getMainImage();
			}else{
				if(null != discuss.getArticlePhotoFilename()){
					storyImage = "http://beautifulyears.com" + discuss.getArticlePhotoFilename();
				}else{
					storyImage = "";
				}
			}
			
			if(storyImage != ""){
				borderStart = "<img style='border: 0;display: block;max-width: 100%; height:auto; border:5px solid #F1F1F1' src='";
				borderEnd = "' alt='' width='470'/>";
			}else{
				borderStart = "";
				borderEnd = "";
			}
			
			if(null == discuss.getLinkInfo()){
				description = discuss.getShortSynopsis();
			}else{
				description = discuss.getLinkInfo().getDescription();
			}
			
			String id = String.valueOf(discussId);
			
			String userId = discuss.getUserId();
			String firstName = discuss.getUsername();
			
			String currentUserId = currentUser.getId();
		    String currentUserFirstName  = currentUser.getUserName();
			
			emailInfo.setEmailIds(emailParams.getEmailIds());
			emailInfo.setSubject(title);
			emailInfo.setBody(MessageFormat.format(
					resourceUtil.getResource("shareInEmail"),
					senderName, shareMessage, profileImage, userName, dateDiff, title, borderStart, storyImage, borderEnd, description, id, userId, firstName, currentUserId, currentUserFirstName));
			
			shareInMail(emailInfo);
			
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
