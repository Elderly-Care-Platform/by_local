/**
 * 
 */
package com.beautifulyears.rest.likeHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.beautifulyears.domain.DiscussLike;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussLikeRepository;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */
public abstract class LikeController<T> {

	private DiscussLikeRepository discussLikeRepository;

	public LikeController(DiscussLikeRepository discussLikeRepository) {
		this.discussLikeRepository = discussLikeRepository;
	}

	public Object submitLike(User user, String contentId, int contentType)
			throws Exception {
		LoggerUtil.logEntry();
		DiscussLike discussLike = null;
		try {
			discussLike = new DiscussLike(user, contentId, contentType);
			discussLikeRepository.save(discussLike);

		} catch (Exception e) {
			Util.handleException(e);
		}
		return discussLike;
	}

	abstract Object likeContent(String id, String type,String url, HttpServletRequest req,
			HttpServletResponse res) throws Exception;

	abstract void sendMailForLike(T LikedEntity, User user, String url) ;

}
