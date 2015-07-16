package com.beautifulyears.rest;

import java.text.MessageFormat;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussLike;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.mail.MailHandler;
import com.beautifulyears.repository.DiscussLikeRepository;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.ResourceUtil;
import com.beautifulyears.util.Util;

/**
 * Controller to handle all the like posting in discuss (for discuss
 * contents/commets/answers)
 * 
 * @author Nitin
 */
@Controller
@RequestMapping("/discussLike")
public class DiscussLikeController {

	private DiscussRepository discussRepository;
	private DiscussLikeRepository discussLikeRepository;
	private DiscussReplyRepository discussReplyRepository;
	private Logger logger = Logger.getLogger(DiscussLikeController.class);

	@Autowired
	public DiscussLikeController(DiscussRepository discussRepository,
			DiscussReplyRepository discussReplyRepository,
			DiscussLikeRepository discussLikeRepository) {
		this.discussRepository = discussRepository;
		this.discussLikeRepository = discussLikeRepository;
		this.discussReplyRepository = discussReplyRepository;
	}

	/**
	 * API for liking a discuss content
	 * 
	 * @param discussId
	 * @param req
	 * @param res
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = { RequestMethod.POST }, params = "type=0")
	@ResponseBody
	public Object submitDiscussLike(
			@RequestParam(value = "discussId", required = true) String discussId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		Object response = null;
		try {
			DiscussResponse discussResponse = new DiscussResponse();
			Discuss discuss = null;
			User user = Util.getSessionUser(req);

			if (null == user) {
				throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
			} else {

				discuss = (Discuss) discussRepository.findOne(discussId);
				if (discuss != null) {
					DiscussLike discussLike = null;

					if (discuss.getLikedBy().contains(user.getId())) {
						throw new BYException(
								BYErrorCodes.DISCUSS_ALREADY_LIKED_BY_USER);
					} else {
						discussLike = new DiscussLike(user, discussId,
								DiscussConstants.DISCUSS_TYPE_DISCUSS);
						discuss.getLikedBy().add(user.getId());
						sendMailForLikeOnDiscuss(discuss,user);
						discussLikeRepository.save(discussLike);
						discussRepository.save(discuss);
						logger.debug("discuss content liked successfully");
						
						response =  BYGenericResponseHandler.getResponse(discussResponse
								.getDiscussEntity(discuss, user));
					}
				} else {
					throw new BYException(BYErrorCodes.DISCUSS_NOT_FOUND);
				}

			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return response;
	}

	/**
	 * API for liking the reply of type comment i.e. type = 1
	 * 
	 * @param replyId
	 * @param req
	 * @param res
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = { RequestMethod.POST }, params = "type=1")
	@ResponseBody
	public Object submitCommentLike(
			@RequestParam(value = "replyId", required = true) String replyId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		int replyType = DiscussConstants.DISCUSS_TYPE_COMMENT;
		return BYGenericResponseHandler.getResponse(submitReplyLike(replyType,
				replyId, req, res));

	}

	/**
	 * API for liking the reply of type answer i.e. type 2
	 * 
	 * @param replyId
	 * @param req
	 * @param res
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = { RequestMethod.POST }, params = "type=2")
	@ResponseBody
	public Object submitAnswerLike(
			@RequestParam(value = "replyId", required = true) String replyId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		int replyType = DiscussConstants.DISCUSS_TYPE_ANSWER;
		return BYGenericResponseHandler.getResponse(submitReplyLike(replyType,
				replyId, req, res));

	}

	private Object submitReplyLike(int replyType, String contentId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		DiscussReply reply = null;
		try {
			User user = Util.getSessionUser(req);
			if (null == user) {
				throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
			} else {

				reply = (DiscussReply) discussReplyRepository
						.findOne(contentId);
				if (reply != null && reply.getReplyType() == replyType) {
					DiscussLike discussLike = null;
					if (reply.getLikedBy().contains(user.getId())) {
						throw new BYException(
								BYErrorCodes.DISCUSS_ALREADY_LIKED_BY_USER);
					} else {
						logger.debug("creating new like for discuss");
						discussLike = new DiscussLike(user, contentId,
								DiscussConstants.DISCUSS_TYPE_DISCUSS);
						reply.getLikedBy().add(user.getId());
						sendMailForLikeOnComments(reply, user);
						discussLikeRepository.save(discussLike);
						discussReplyRepository.save(reply);
						
					}
				}
			}
			reply.setLikeCount(reply.getLikedBy().size());
			if (null != user && reply.getLikedBy().contains(user.getId())) {
				reply.setLikedByUser(true);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return reply;
	}
	
	private void sendMailForLikeOnDiscuss(Discuss discuss, User user) {
		if(!discuss.getUserId().equals(user.getId())){
			ResourceUtil resourceUtil = new ResourceUtil("mailTemplate.properties");
			String title = !Util.isEmpty(discuss.getTitle()) ? discuss.getTitle() : discuss.getText();
			String userName = !Util.isEmpty(discuss.getUsername()) ? discuss.getUsername() : "Anonymous User";
			String body = MessageFormat.format(resourceUtil.getResource("likedBy"), userName, "content",title , user.getUserName());
			MailHandler.sendMailToUserId(discuss.getUserId(), "Your content was liked on beautifulYears.com", body);
		}
	}
	
	private void sendMailForLikeOnComments(DiscussReply reply, User user) {
		if(!reply.getUserId().equals(user.getId())){
			ResourceUtil resourceUtil = new ResourceUtil("mailTemplate.properties");
			String title = reply.getText();
			String userName = !Util.isEmpty(reply.getUserName()) ? reply.getUserName() : "Anonymous User";
			String replyTypeString = (reply.getReplyType() == DiscussConstants.DISCUSS_TYPE_ANSWER) ? "answer" : "comment";
			String body = MessageFormat.format(resourceUtil.getResource("likedBy"), userName,replyTypeString, title , user.getUserName());
			MailHandler.sendMailToUserId(reply.getUserId(), "Your "+replyTypeString+" was liked on beautifulYears.com", body);
		}
	}

}