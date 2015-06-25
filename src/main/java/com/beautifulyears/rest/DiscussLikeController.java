package com.beautifulyears.rest;

import java.io.IOException;

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
import com.beautifulyears.Util;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussLike;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussLikeRepository;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.rest.response.DiscussResponse;

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

	@RequestMapping(method = { RequestMethod.POST }, params = "type=0")
	@ResponseBody
	public DiscussResponse.DiscussEntity submitDiscussLike(
			@RequestParam(value = "discussId", required = true) String discussId,
			HttpServletRequest req, HttpServletResponse res) throws IOException {

		Discuss discuss = null;
		User user = Util.getSessionUser(req);
		DiscussResponse discussResponse = new DiscussResponse();

		if (null == user) {
			logger.error("Attempt made to like a content before logging in");
			res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return null;
		} else {
			try {

				discuss = (Discuss) discussRepository.findOne(discussId);
				if (discuss != null) {

					DiscussLike discussLike = null;

					if (discuss.getLikedBy().contains(user.getId())) {
						logger.error("user has already liked this content");
					} else {
						logger.debug("creating new like for discuss");
						discussLike = new DiscussLike(user, discussId,
								DiscussConstants.DISCUSS_TYPE_DISCUSS);
						discuss.getLikedBy().add(user.getId());
						discussLikeRepository.save(discussLike);
						discussRepository.save(discuss);

					}
				}
				return discussResponse.getDiscussEntity(discuss, user);
			} catch (Exception e) {
				e.printStackTrace();
				res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
		}
		return discussResponse.getDiscussEntity(null, null);
	}

	@RequestMapping(method = { RequestMethod.POST }, params = "type=1")
	@ResponseBody
	public DiscussReply submitCommentLike(
			@RequestParam(value = "replyId", required = true) String replyId,
			HttpServletRequest req, HttpServletResponse res) throws IOException {

		int replyType = DiscussConstants.DISCUSS_TYPE_COMMENT;
		return submitReplyLike(replyType, replyId, req, res);

	}

	@RequestMapping(method = { RequestMethod.POST }, params = "type=2")
	@ResponseBody
	public DiscussReply submitAnswerLike(
			@RequestParam(value = "replyId", required = true) String replyId,
			HttpServletRequest req, HttpServletResponse res) throws IOException {

		int replyType = DiscussConstants.DISCUSS_TYPE_ANSWER;
		return submitReplyLike(replyType, replyId, req, res);

	}

	private DiscussReply submitReplyLike(int replyType, String contentId,
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		DiscussReply reply = null;
		User user = Util.getSessionUser(req);

		if (null == user) {
			logger.error("Attempt made to like a content before logging in");
			res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return null;
		} else {
			try {

				reply = (DiscussReply) discussReplyRepository
						.findOne(contentId);
				if (reply != null && reply.getReplyType() == replyType) {
					DiscussLike discussLike = null;
					if (reply.getLikedBy().contains(user.getId())) {
						logger.error("user has already liked this content");
					} else {
						logger.debug("creating new like for discuss");
						discussLike = new DiscussLike(user, contentId,
								DiscussConstants.DISCUSS_TYPE_DISCUSS);
						reply.getLikedBy().add(user.getId());
						discussLikeRepository.save(discussLike);
						discussReplyRepository.save(reply);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
		}
		reply.setLikeCount(reply.getLikedBy().size());
		if (null != user && reply.getLikedBy().contains(user.getId())) {
			reply.setLikedByUser(true);
		}
		return reply;
	}

}