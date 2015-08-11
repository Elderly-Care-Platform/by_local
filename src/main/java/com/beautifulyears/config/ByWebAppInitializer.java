package com.beautifulyears.config;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration.Dynamic;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import com.beautifulyears.servlet.UploadFile;

public class ByWebAppInitializer implements
		WebApplicationInitializer {
	
    public static ServletContext servletContext;

	@Override
	public void onStartup(ServletContext servletContext)
			throws ServletException {
		System.out.println("***Starting by application ***");
		System.out.println("mail supported is "+servletContext.getInitParameter("mail"));
		ByWebAppInitializer.servletContext = servletContext;
		//root path used in logs config
		System.setProperty("rootPath", servletContext.getRealPath("/"));
		AnnotationConfigWebApplicationContext webApplicationContext = new AnnotationConfigWebApplicationContext();
		webApplicationContext.register(ApplicationConfig.class,
				WebMvcConfig.class);

		Dynamic dynamc = servletContext.addServlet("dispatcherServlet",
				new DispatcherServlet(webApplicationContext));
		dynamc.addMapping("/api/v1/*");
		dynamc.setLoadOnStartup(1);
		
		Dynamic dynamc2 = servletContext.addServlet("UploadFile",
				new UploadFile());
		dynamc2.addMapping("/UploadFile");
		dynamc2.setLoadOnStartup(1);
		dynamc2.setAsyncSupported(true);

	}

}
