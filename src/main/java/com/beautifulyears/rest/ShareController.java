package com.beautifulyears.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.EmailInfo;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.mail.MailHandler;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.util.ShareEmailHelper;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.SharedActivityLogHandler;

@Controller
@RequestMapping("/share")
public class ShareController {

	private static final Logger logger = Logger
			.getLogger(ShareController.class);
	private DiscussRepository discussRepository;
	ActivityLogHandler<Object> shareLogHandler;

	@Autowired
	public ShareController(DiscussRepository discussRepository,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
		shareLogHandler = new SharedActivityLogHandler(mongoTemplate);

	}

	/**
	 * 
	 * Mail format EmailId : [name1@domain.com, name2@domain.com] Subject :
	 * "some message here" body : "text"
	 * 
	 */

	@RequestMapping(value = "/email/{discussId}", method = RequestMethod.POST)
	@ResponseBody
	public Object shareWithEmail(@RequestBody EmailInfo emailParams,
			@PathVariable("discussId") String discussId,
			HttpServletRequest request) throws Exception {

		EmailInfo emailInfo = new EmailInfo();
		User currentUser = Util.getSessionUser(request);
		Discuss discuss = discussRepository.findOne(discussId);

		String subject = discuss.getTitle();
		if (Util.isEmpty(subject)) {
			if (null != discuss.getLinkInfo()) {
				subject = discuss.getLinkInfo().getTitle();
			} else if (!Util.isEmpty(discuss.getShortSynopsis())) {
				subject = discuss.getShortSynopsis().trim();
				subject = Util.truncateText(subject, 30);
			} else if (null == discuss.getShortSynopsis()) {
				Document doc = Jsoup.parse(discuss.getText());
				String text = doc.text();
				if (text.length() > 30) {
					subject = Util.truncateText(text, 30);
				} else {
					subject = text;
				}
				discuss.setShortSynopsis(Util.truncateText(text));
			}
		}
		Map<String, String> params = new HashMap<String, String>();
		params.put("msg", emailParams.getSubject());
		params.put("title", subject);
		params.put("senderName", emailParams.getSenderName());
		String body = ShareEmailHelper.getEmailContent(discuss, currentUser,
				params);

		try {
			emailInfo.setEmailIds(emailParams.getEmailIds());
			emailInfo.setSubject(subject);
			emailInfo.setBody(body);
			shareInMail(emailInfo);

		} catch (Exception e) {
			logger.error(BYErrorCodes.ERROR_IN_SENDING_MAIL);
			Util.handleException(e);
		}

		shareLogHandler.addLog(discuss, ActivityLogConstants.CRUD_TYPE_CREATE,
				request);

		Util.logStats(HousingController.staticMongoTemplate,
				"sharing discuss content on email", currentUser.getId(),
				currentUser.getEmail(), discussId, null, null, null,
				"sharing discuss content on email = " + discussId, "COMMUNITY");
		return discuss;
	}

	public static void shareInMail(EmailInfo emailInfo) {
		List<String> email = emailInfo.getEmailIds();
		String subject = emailInfo.getSubject();
		String body = emailInfo.getBody();
		MailHandler.sendMultipleMail(email, subject, body);
	}

}
