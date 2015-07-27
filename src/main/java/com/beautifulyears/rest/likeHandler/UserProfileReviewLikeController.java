package com.beautifulyears.rest.likeHandler;

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

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.mail.MailHandler;
import com.beautifulyears.repository.DiscussLikeRepository;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.ResourceUtil;
import com.beautifulyears.util.Util;

@Controller
@RequestMapping("/userProfileReviewLike")
public class UserProfileReviewLikeController extends LikeController<DiscussReply> {

	private DiscussReplyRepository discussReplyRepository;
	private Logger logger = Logger.getLogger(UserProfileReviewLikeController.class);

	@Autowired
	public UserProfileReviewLikeController(DiscussLikeRepository discussLikeRepository,
			DiscussReplyRepository discussReplyRepository) {
		super(discussLikeRepository);
		this.discussReplyRepository = discussReplyRepository;
		// TODO Auto-generated constructor stub
	}

	@Override
	@RequestMapping(method = { RequestMethod.POST })
	@ResponseBody
	Object likeContent(
			@RequestParam(value = "reviewId", required = true) String id,
			@RequestParam(value = "type", required = true) String type,
			@RequestParam(value = "url", required = true) String url,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		int replyType = DiscussConstants.REPLY_TYPE_REVIEW;
		DiscussReply reply = null;
		try {
			User user = Util.getSessionUser(req);
			if (null == user) {
				throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
			} else {

				reply = (DiscussReply) discussReplyRepository.findOne(id);
				if (reply != null && reply.getReplyType() == replyType) {
					if (reply.getLikedBy().contains(user.getId())) {
						throw new BYException(
								BYErrorCodes.DISCUSS_ALREADY_LIKED_BY_USER);
					} else {
						submitLike(user, id,
								DiscussConstants.CONTENT_TYPE_DISCUSS);
						reply.getLikedBy().add(user.getId());
						sendMailForLike(reply, user, url);
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

	@Override
	void sendMailForLike(DiscussReply likedEntity, User user, String url) {
		try {
			if (!likedEntity.getUserId().equals(user.getId())) {
				ResourceUtil resourceUtil = new ResourceUtil(
						"mailTemplate.properties");
				String title = likedEntity.getText();
				String userName = !Util.isEmpty(likedEntity.getUserName()) ? likedEntity
						.getUserName() : "Anonymous User";
				String replyTypeString = "review";
				String body = MessageFormat.format(
						resourceUtil.getResource("likedBy"), userName,
						replyTypeString, title, user.getUserName(), url, url);
				MailHandler.sendMailToUserId(likedEntity.getUserId(), "Your "
						+ replyTypeString + " was liked on beautifulYears.com",
						body);
			}
		} catch (Exception e) {
			logger.error(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		}
	}

}