/**
 * 
 */
package com.beautifulyears.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserShippingAddress;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */
@Controller
@RequestMapping(value = { "/userAddress" })
public class UserAddressController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public UserAddressController(MongoTemplate mongoTemplate) {
		super();
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserShippingAddress(
			@PathVariable(value = "userId") String userId,
			@RequestParam(value = "addressId", required = false) String addressId,
			HttpServletRequest req) throws Exception {
		User user = Util.getSessionUser(req);
		if (null == user) {
			throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
		} else if (null != user.getId() && !user.getId().equals(userId)) {
			throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
		}

		List<UserShippingAddress> addressList;
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId));
		if (null != addressId) {
			q.addCriteria(Criteria.where("id").is(addressId));
		}
		addressList = mongoTemplate.find(q, UserShippingAddress.class);
		Util.logStats(mongoTemplate, "get user shipping address", userId,
				user.getEmail(), null, null, null, null,
				"getting shipping address ", "PRODUCT");
		return BYGenericResponseHandler.getResponse(addressList);
	}

	@RequestMapping(method = { RequestMethod.POST }, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object saveNewAddress(@PathVariable(value = "userId") String userId,
			@RequestBody UserShippingAddress address, HttpServletRequest req)
			throws Exception {
		User user = Util.getSessionUser(req);
		if (SessionController.checkCurrentSessionFor(req, "NEW_ADDRESS")) {
			if (null == user) {
				throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
			} else if (null != user.getId() && !user.getId().equals(userId)) {
				throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
			}
			address.setUserId(userId);
			address.setId(null);
			mongoTemplate.save(address);
		}
		Util.logStats(mongoTemplate, "New shipping address", userId, null,
				address.getId(), null, null, null,
				"Adding new shipping address", "PRODUCT");
		return BYGenericResponseHandler.getResponse(address);
	}

	@RequestMapping(method = { RequestMethod.PUT }, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object editAddress(@PathVariable(value = "userId") String userId,
			@RequestBody UserShippingAddress address, HttpServletRequest req)
			throws Exception {
		User user = Util.getSessionUser(req);
		Object ret = null;
		if (SessionController.checkCurrentSessionFor(req, "NEW_ADDRESS")) {
			if (null == user) {
				throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
			} else if (null != user.getId()
					&& (!user.getId().equals(userId) || !user.getId().equals(
							address.getUserId()))) {
				throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
			}
			Query q = new Query();
			q.addCriteria(Criteria.where("userId").is(userId));
			q.addCriteria(Criteria.where("id").is(address.getId()));

			UserShippingAddress oldAddress = mongoTemplate.findOne(q,
					UserShippingAddress.class);
			updateWithNewAddress(oldAddress, address);

			mongoTemplate.save(oldAddress);
			Util.logStats(mongoTemplate, "Editing shipping address", userId,
					null, address.getId(), null, null, null,
					"Editing new shipping address", "PRODUCT");
			ret = BYGenericResponseHandler.getResponse(oldAddress);
		}
		return ret;
	}

	private void updateWithNewAddress(UserShippingAddress oldAddress,
			UserShippingAddress newAddress) {
		oldAddress.setAddress(newAddress.getAddress());
		oldAddress.setEmail(newAddress.getEmail());
		oldAddress.setFirstName(newAddress.getFirstName());
		oldAddress.setLastName(newAddress.getLastName());
		oldAddress.setPhoneNumber(newAddress.getPhoneNumber());
	}

}
