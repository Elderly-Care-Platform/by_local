package com.beautifulyears.rest;

import java.text.MessageFormat;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.mail.MailHandler;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.DiscussDetailResponse;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.ResourceUtil;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.ReplyActivityLogHandler;

/**
 * Controller to handle all the discuss detail related API 1. getting full
 * discuss detail (discuss + replies) 2. Posting comment 3. Posting answer
 * 
 * @author Nitin
 * 
 *
 */
@Controller
@RequestMapping("/discussDetail")
public class DiscussDetailController {
	private static final Logger logger = Logger
			.getLogger(DiscussDetailController.class);
	private MongoTemplate mongoTemplate;
	private DiscussRepository discussRepository;
	private DiscussReplyRepository discussReplyRepository;
	private ActivityLogHandler<DiscussReply> logHandler;

	@Autowired
	public DiscussDetailController(MongoTemplate mongoTemplate,
			DiscussRepository discussRepository,
			DiscussReplyRepository discussReplyRepository) {
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
		this.discussReplyRepository = discussReplyRepository;
		logHandler = new ReplyActivityLogHandler(mongoTemplate);
	}

	/**
	 * API to get the discuss detail for provided discussId
	 * 
	 * @param req
	 * @param res
	 * @param discussId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = { RequestMethod.GET }, value = { "" }, produces = { "application/json" })
	@ResponseBody
	public Object getDiscussDetail(HttpServletRequest req,
			HttpServletResponse res,
			@RequestParam(value = "discussId", required = true) String discussId)
			throws Exception {
		LoggerUtil.logEntry();
		return BYGenericResponseHandler.getResponse(getDiscussDetailById(
				discussId, req));

	}

	/**
	 * API for posting a reply of type comment
	 * 
	 * @param comment
	 * @param req
	 * @param res
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = { RequestMethod.POST }, params = "type=0", consumes = { "application/json" })
	@ResponseBody
	public Object submitComment(@RequestBody DiscussReply comment,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		String discussId = comment.getDiscussId();
		try {
			Discuss discuss = discussRepository.findOne(discussId);
			List<DiscussReply> ancestors = null;
			if (null != discuss) {
				comment.setDiscussId(discuss.getId());
				comment.setContentType(Util.getDiscussContentType(discuss
						.getDiscussType()));
				comment.setReplyType(DiscussConstants.REPLY_TYPE_COMMENT);
				User user = Util.getSessionUser(req);
				if (null != user) {
					comment.setUserId(user.getId());
					comment.setUserName(user.getUserName());
					Query query = new Query();
					query.addCriteria(Criteria.where("userId").is(user.getId()));
					UserProfile profile = mongoTemplate.findOne(query,
							UserProfile.class);
					comment.setUserProfile(profile);
				} else {
					throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
				}
				if (!Util.isEmpty(comment.getParentReplyId())) {
					// if nested comment
					DiscussReply parentComment = discussReplyRepository
							.findOne(comment.getParentReplyId());
					if (null != parentComment) {
						parentComment.setUrl(comment.getUrl());
						parentComment.setDirectChildrenCount(parentComment
								.getDirectChildrenCount() + 1);
						comment.getAncestorsId().addAll(
								parentComment.getAncestorsId());
						comment.getAncestorsId().add(parentComment.getId());
						comment.setParentReplyId(parentComment.getId());
						mongoTemplate.save(parentComment);
					}
					Query query = new Query();
					query.addCriteria(Criteria.where("id").in(
							comment.getAncestorsId()));
					ancestors = this.mongoTemplate.find(query,
							DiscussReply.class);
					for (DiscussReply ancestor : ancestors) {
						ancestor.setChildrenCount(ancestor.getChildrenCount() + 1);
						mongoTemplate.save(ancestor);
					}
					sendMailForReplyOnReply(parentComment, user);

				} else {
					discuss.setDirectReplyCount(discuss.getDirectReplyCount() + 1);
					sendMailForReplyOnDiscuss(discuss, user, comment);
				}

				discuss.setAggrReplyCount(discuss.getAggrReplyCount() + 1);
				mongoTemplate.save(discuss);
				mongoTemplate.save(comment);
				logHandler.addLog(comment, ActivityLogConstants.CRUD_TYPE_CREATE, req);
				
				logger.debug("new answer posted successfully with replyId = "
						+ comment.getId());
			} else {
				throw new BYException(BYErrorCodes.DISCUSS_NOT_FOUND);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(getDiscussDetailById(
				discussId, req));

	}

	/**
	 * API for posting a reply of type answer
	 * 
	 * @param answer
	 * @param req
	 * @param res
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = { RequestMethod.POST }, params = "type=1", consumes = { "application/json" })
	@ResponseBody
	public Object submitAnswer(@RequestBody DiscussReply answer,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		String discussId = answer.getDiscussId();
		try {
			Discuss discuss = discussRepository.findOne(discussId);
			if (null != discuss) {
				answer.setDiscussId(discuss.getId());
				answer.setReplyType(DiscussConstants.REPLY_TYPE_ANSWER);
				answer.setContentType(Util.getDiscussContentType(discuss
						.getDiscussType()));
				answer.setParentReplyId(null);
				User user = Util.getSessionUser(req);
				if (null != user) {
					answer.setUserId(user.getId());
					answer.setUserName(user.getUserName());
					Query query = new Query();
					query.addCriteria(Criteria.where("userId").is(user.getId()));
					UserProfile profile = mongoTemplate.findOne(query,
							UserProfile.class);
					answer.setUserProfile(profile);
				} else {
					throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
				}
				discuss.setAggrReplyCount(discuss.getAggrReplyCount() + 1);
				discuss.setDirectReplyCount(discuss.getDirectReplyCount() + 1);
				mongoTemplate.save(discuss);
				mongoTemplate.save(answer);
				logHandler.addLog(answer, ActivityLogConstants.CRUD_TYPE_CREATE, req);
				sendMailForReplyOnDiscuss(discuss, user, answer);
				logger.debug("new answer posted successfully with replyId = "
						+ answer.getId());
			} else {
				throw new BYException(BYErrorCodes.DISCUSS_NOT_FOUND);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(getDiscussDetailById(
				discussId, req));
	}

	private DiscussDetailResponse getDiscussDetailById(String discussId,
			HttpServletRequest req) throws Exception {
		DiscussDetailResponse response = new DiscussDetailResponse();
		try {
			Discuss discuss = discussRepository.findOne(discussId);
			if (null != discuss) {
				response.addDiscuss(discuss, Util.getSessionUser(req));

				Query query = new Query();
				query.addCriteria(Criteria.where("discussId").is(discussId))
						.addCriteria(
								Criteria.where("status").is(
										DiscussConstants.REPLY_STATUS_ACTIVE));
				query.with(new Sort(Sort.Direction.ASC,
						new String[] { "createdAt" }));
				List<DiscussReply> replies = this.mongoTemplate.find(query,
						DiscussReply.class);

				response.addReplies(replies, Util.getSessionUser(req));
			} else {
				throw new BYException(BYErrorCodes.DISCUSS_NOT_FOUND);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return response.getResponse();
	}

	private void sendMailForReplyOnDiscuss(Discuss discuss, User user,
			DiscussReply reply) {
		try {
			if (!discuss.getUserId().equals(user.getId())) {
				ResourceUtil resourceUtil = new ResourceUtil(
						"mailTemplate.properties");
				String title = !Util.isEmpty(discuss.getTitle()) ? discuss
						.getTitle() : discuss.getText();
				if (Util.isEmpty(title) && discuss.getLinkInfo() != null) {
					title = !Util.isEmpty(discuss.getLinkInfo().getTitle()) ? discuss
							.getLinkInfo().getTitle() : discuss.getLinkInfo()
							.getDescription();
					title = !Util.isEmpty(title) ? title : discuss
							.getLinkInfo().getUrl();
				}
				if(Util.isEmpty(title)){
					title = "<<Your post>>";
				}
				String userName = !Util.isEmpty(discuss.getUsername()) ? discuss
						.getUsername() : "Anonymous User";
				String commentedBy = !Util.isEmpty(user.getUserName()) ? user
						.getUserName() : "Anonymous User";
				String replyTypeString = (reply.getReplyType() == DiscussConstants.REPLY_TYPE_ANSWER) ? "an answer"
						: "comment";
				String path = reply.getUrl();
				String body = MessageFormat.format(
						resourceUtil.getResource("contentCommentedBy"),
						userName, commentedBy, title, path, path);
				MailHandler
						.sendMailToUserId(
								discuss.getUserId(),
								replyTypeString
										+ " is posted on your content at beautifulYears.com",
								body);
			}
		} catch (Exception e) {
			logger.error(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		}

	}

	private void sendMailForReplyOnReply(DiscussReply reply, User user) {
		try {
			if (!reply.getUserId().equals(user.getId())) {
				ResourceUtil resourceUtil = new ResourceUtil(
						"mailTemplate.properties");
				String userName = !Util.isEmpty(reply.getUserName()) ? reply
						.getUserName() : "Anonymous User";
				String commentedBy = !Util.isEmpty(user.getUserName()) ? user
						.getUserName() : "Anonymous User";
				String replyString = "previous comment";
				String path = reply.getUrl();
				String replyText = Util.isEmpty(reply.getText()) ? "<<Your reply>>" : reply.getText();
				String body = MessageFormat.format(
						resourceUtil.getResource("replyCommentedBy"), userName,
						commentedBy, replyString, replyText, path, path);
				MailHandler
						.sendMailToUserId(
								reply.getUserId(),
								"A comment is posted on your comment at beautifulYears.com",
								body);
			}
		} catch (Exception e) {
			logger.error(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		}

	}

}
