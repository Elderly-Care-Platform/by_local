package com.beautifulyears.servlet;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sourceforge.barbecue.Barcode;
import net.sourceforge.barbecue.BarcodeException;
import net.sourceforge.barbecue.BarcodeFactory;
import net.sourceforge.barbecue.BarcodeImageHandler;
import net.sourceforge.barbecue.output.OutputException;

import org.apache.log4j.Logger;

import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.constants.CDNConstants;
import com.beautifulyears.util.S3FileUploader;

public class GenerateBarCode extends HttpServlet {
	private static final long serialVersionUID = 1L;
//	private String uploadDir = BYConstants.IMAGE_CDN_PATH;
	private String s3MediaBucketName;

	private static final Logger logger = Logger
			.getLogger(GenerateBarCode.class);

	public void init() {
		if (null != System.getProperty("imageUploadPath")) {
			// uploadDir = System.getProperty("imageUploadPath");
			// System.out.println("uploadDir === "+uploadDir);
			s3MediaBucketName = System.getProperty("s3MediaBucketName");
		}
	}

	@Override
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String barcodePath = "";
		String dataString = request.getParameter("barcodeString");
		String path = null;
		Barcode b;
		try {
			b = BarcodeFactory.createCode128(dataString);

			BufferedImage barImage = BarcodeImageHandler.getImage(b);
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			ImageIO.write(barImage, "PNG", out);
			byte[] bytes = out.toByteArray();

			// path = "barcodes/" + dataString + "_" + (new Date()).getTime()
			// + "." + "jpeg";
			// File f = new File(uploadDir + File.separator + path);
			// ImageIO.write(barImage, "jpeg", f);

			path = dataString + "_" + (new Date()).getTime() + "." + "jpeg";
			File f = File.createTempFile(path, ".jpg");
			ImageIO.write(barImage, "jpeg", f);
			barcodePath = (new S3FileUploader(s3MediaBucketName,
					CDNConstants.IMAGE_CDN_BARCODE_FOLDER + "/" + path, f))
					.uploadFile();

		} catch (BarcodeException e) {
			e.printStackTrace();
		} catch (OutputException e) {
			e.printStackTrace();
		}
		response.getWriter().write(barcodePath);
	}

}