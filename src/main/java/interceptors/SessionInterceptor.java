package interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class SessionInterceptor extends HandlerInterceptorAdapter{
	private static final Logger logger = Logger.getLogger(SessionInterceptor.class);
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
            Object handler) throws Exception {
		String sessionId = request.getHeader("sess");
		logger.debug("--------------------------------------------------------------sessionId = "+sessionId);
		
		return true;
    }
	
}
