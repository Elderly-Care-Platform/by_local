package com.beautifulyears.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.Topic;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserRating;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.repository.UserRatingRepository;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

@Controller
@RequestMapping("/reviewRate")
public class ReviewController {
	private Logger logger = Logger.getLogger(ReviewController.class);
	private DiscussReplyRepository discussReplyRepository;
	private UserRatingRepository userRatingRepository;
	private MongoTemplate mongoTemplate;
	private UserProfileRepository userProfileRepository;

	@Autowired
	public ReviewController(DiscussReplyRepository discussReplyRepository,
			UserRatingRepository userRatingRepository,
			UserProfileRepository userProfileRepository,
			MongoTemplate mongoTemplate) {
		this.discussReplyRepository = discussReplyRepository;
		this.userRatingRepository = userRatingRepository;
		this.userProfileRepository = userProfileRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "", consumes = { "application/json" })
	@ResponseBody
	public Object submitReviewRate(
			@RequestParam(value = "reviewType", required = true) Integer reviewType,
			@RequestParam(value = "associatedId", required = true) String associatedId,
			@RequestBody DiscussReply reviewRate, HttpServletRequest req,
			HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		User user = Util.getSessionUser(req);

		DiscussReply newReview = reviewRate;
		if (null != user) {
			if (null != reviewType && null != associatedId && null != newReview) {
				if (isSelfAccessment(associatedId, reviewType, user)) {
					throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
				}
				submitRating(reviewType, associatedId, newReview, user);
				submitReview(reviewType, associatedId, newReview, user);
			} else {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}
		} else {
			logger.debug("user must login to submit review aand ratings");
			throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
		}
		return null;
	}

	private DiscussReply submitReview(Integer reviewType, String associatedId,
			DiscussReply newReviewRate, User user) {
		DiscussReply review = null;
		review = this.getReview(reviewType, associatedId, user);
		if (null != newReviewRate.getText()) {
			if (null == review) {
				review = new DiscussReply();
				review.setDiscussId(associatedId);
				review.setUserRating(newReviewRate.getUserRating());
				review.setReplyType(reviewType);
				review.setText(newReviewRate.getText());
				review.setUserId(user.getId());
				review.setUserName(user.getUserName());
				updateAllDependantEntities(reviewType, review);
			} else {
				review.setText(newReviewRate.getText());
			}
		}
		if (null != review) {
			review.setUserRating(newReviewRate.getUserRating() == null ? review
					.getUserRating() : newReviewRate.getUserRating());
			discussReplyRepository.save(review);
		}
		
		return review;
	}

	private UserRating submitRating(Integer reviewType, String associatedId,
			DiscussReply reviewRate, User user) {
		UserRating rating = null;
		if (null != reviewRate.getUserRating() && null != reviewType
				&& null != reviewRate && null != user) {
			rating = this.getRating(reviewType, associatedId, user);
			if (null == rating) {
				rating = new UserRating();
				rating.setAssociatedContentType(reviewType);
				rating.setAssociatedId(associatedId);
				rating.setUserId(user.getId());
				rating.setUserName(user.getUserName());
				updateAllDependantEntities(reviewType, rating);
			}
			rating.setValue(reviewRate.getUserRating());
			userRatingRepository.save(rating);
		} else {
			logger.debug("not updating any rating");
		}
		return rating;
	}

	private UserRating getRating(Integer reviewType, String associatedId,
			User user) {
		Query query = new Query();
		query.addCriteria(Criteria.where("associatedContentType")
				.is(reviewType).and("associatedId").is(associatedId)
				.and("userId").is(user.getId()));
		return this.mongoTemplate.findOne(query, UserRating.class);
	}

	private DiscussReply getReview(Integer reviewType, String associatedId,
			User user) {
		Query query = new Query();
		query.addCriteria(Criteria.where("replyType").is(reviewType)
				.and("discussId").is(associatedId).and("userId")
				.is(user.getId()));
		return this.mongoTemplate.findOne(query, DiscussReply.class);
	}

	private void updateAllDependantEntities(Integer reviewType,
			UserRating rating) {
		switch (reviewType) {
		case DiscussConstants.DISCUSS_TYPE_REVIEW_INSTITUTION:
			updateInstitutionRating(rating);
			break;
		default:
			throw new BYException(BYErrorCodes.REVIEW_TYPE_INVALID);
		}
	}

	private void updateAllDependantEntities(Integer reviewType,
			DiscussReply rating) {
		switch (reviewType) {
		case DiscussConstants.DISCUSS_TYPE_REVIEW_INSTITUTION:
			updateInstitutionReviews(rating);
			break;
		default:
			throw new BYException(BYErrorCodes.REVIEW_TYPE_INVALID);
		}
	}

	private void updateInstitutionRating(UserRating rating) {
		UserProfile profile = this.userProfileRepository.findOne(rating
				.getAssociatedId());
		if (null != profile
				&& !profile.getRatedBy().contains(rating.getUserId())) {
			profile.getRatedBy().add(rating.getUserId());
			this.userProfileRepository.save(profile);
		}
	}

	private void updateInstitutionReviews(DiscussReply review) {
		UserProfile profile = this.userProfileRepository.findOne(review
				.getDiscussId());
		if (null != profile
				&& !profile.getReviewedBy().contains(review.getUserId())) {
			profile.getReviewedBy().add(review.getUserId());
			this.userProfileRepository.save(profile);
		}
	}

	private boolean isSelfAccessment(String associatedId, Integer reviewType,
			User user) throws Exception {
		boolean isSelf = false;
		try {
			switch (reviewType) {
			case DiscussConstants.DISCUSS_TYPE_REVIEW_INSTITUTION:
				UserProfile userProfile = this.userProfileRepository
						.findByUserId(user.getId());
				if (userProfile.getId().equals(associatedId)) {
					isSelf = true;
				}
				break;

			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return isSelf;
	}

}
