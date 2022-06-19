package com.codetantra.testscripts;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Map.Entry;

import org.testng.TestNG;
import org.testng.xml.XmlClass;
import org.testng.xml.XmlSuite;
import org.testng.xml.XmlTest;

import com.codetantra.lib.CommonFunctions;
import com.codetantra.variables.Global;


public class ProjectRunner {

	public static void main(String[] args) {

		
	
		XmlSuite suite = new XmlSuite();
	    suite.setName("CT_Automation");
	    

	    List<XmlClass> classes00 = new ArrayList<XmlClass>();
	    classes00.add(new XmlClass("com.codetantra.testscripts.TS01Login"));
	    XmlTest test00 = new XmlTest(suite);
	    test00.setName("CT_Automation");
	    test00.setXmlClasses(classes00);
	    List<XmlSuite> suites00 = new ArrayList<XmlSuite>();
	    suites00.add(suite);
	    
	    
	    List<XmlClass> classes01 = new ArrayList<XmlClass>();
	    classes01.add(new XmlClass("com.codetantra.testscripts.TS02LearningCourse"));
	    XmlTest test01 = new XmlTest(suite);
	    test01.setName("Learning Course");
	    test01.setXmlClasses(classes01);
	    List<XmlSuite> suites01 = new ArrayList<XmlSuite>();
	    suites01.add(suite);


	    List<XmlClass> classes02 = new ArrayList<XmlClass>();
	    classes02.add(new XmlClass("com.codetantra.testscripts.TS03LearningLesson"));
	    XmlTest test02 = new XmlTest(suite);
	    test02.setName("Learning Lesson");
	    test02.setXmlClasses(classes02);
	    List<XmlSuite> suites02 = new ArrayList<XmlSuite>();
	    suites02.add(suite);

	    
	    List<XmlClass> classes03 = new ArrayList<XmlClass>();
	    classes03.add(new XmlClass("com.codetantra.testscripts.TS04LearningLessonQuestions"));
	    XmlTest test03 = new XmlTest(suite);
	    test03.setName("Lesson_Questions");
	    test03.setXmlClasses(classes03);
	    List<XmlSuite> suites03 = new ArrayList<XmlSuite>();
	    suites03.add(suite);
	    
	    
	    List<XmlClass> classes = new ArrayList<XmlClass>();
	    classes.add(new XmlClass("com.codetantra.testscripts.TS05QuickQuestionAccessinSliderPanel"));
	    XmlTest test = new XmlTest(suite);
	    test.setName("Quick Slider Panel");
	    test.setXmlClasses(classes);
	    List<XmlSuite> suites = new ArrayList<XmlSuite>();
	    suites.add(suite);
	    
	    
	    List<XmlClass> classes1 = new ArrayList<XmlClass>();
	    classes1.add(new XmlClass("com.codetantra.testscripts.TS06ValidateMultiplechoice"));
	    XmlTest test1 = new XmlTest(suite);
	    test1.setName("Multiple Choice");
	    test1.setXmlClasses(classes1);
	    List<XmlSuite> suites1 = new ArrayList<XmlSuite>();
	    suites1.add(suite);


	    List<XmlClass> classes2 = new ArrayList<XmlClass>();
	    classes2.add(new XmlClass("com.codetantra.testscripts.TS07ValidateCopyWriting"));
	    XmlTest test2 = new XmlTest(suite);
	    test2.setName("Copy Writing");
	    test2.setXmlClasses(classes2);
	    List<XmlSuite> suites2 = new ArrayList<XmlSuite>();
	    suites2.add(suite);

	    
	    List<XmlClass> classes3 = new ArrayList<XmlClass>();
	    classes3.add(new XmlClass("com.codetantra.testscripts.TS08VerifyEnterTextInTerminal"));
	    XmlTest test3 = new XmlTest(suite);
	    test3.setName("Terminal");
	    test3.setXmlClasses(classes3);
	    List<XmlSuite> suites3 = new ArrayList<XmlSuite>();
	    suites3.add(suite);
	    
	    List<XmlClass> classes4 = new ArrayList<XmlClass>();
	    classes4.add(new XmlClass("com.codetantra.testscripts.TS09VerifyCompilationErrorsInEditor"));
	    XmlTest test4 = new XmlTest(suite);
	    test4.setName("Editor");
	    test4.setXmlClasses(classes4);
	    List<XmlSuite> suites4 = new ArrayList<XmlSuite>();
	    suites4.add(suite);
	    
	    List<XmlClass> classes5 = new ArrayList<XmlClass>();
	    classes5.add(new XmlClass("com.codetantra.testscripts.TS10ValidateFacultyLockSystem"));
	    XmlTest test5 = new XmlTest(suite);
	    test5.setName("Faculty Lock Question");
	    test5.setXmlClasses(classes5);
	    List<XmlSuite> suites5 = new ArrayList<XmlSuite>();
	    suites5.add(suite);
	    
	    List<XmlClass> classes6 = new ArrayList<XmlClass>();
	    classes6.add(new XmlClass("com.codetantra.testscripts.TS11ValidateLockQuestionMemberwithGroup"));
	    XmlTest test6 = new XmlTest(suite);
	    test6.setName("Lock Question Member with Group");
	    test6.setXmlClasses(classes6);
	    List<XmlSuite> suites6 = new ArrayList<XmlSuite>();
	    suites6.add(suite);
	    
	    List<XmlClass> classes7 = new ArrayList<XmlClass>();
	    classes7.add(new XmlClass("com.codetantra.testscripts.TS12ValidateLockQuestionMemberwithOutGroup"));
	    XmlTest test7 = new XmlTest(suite);
	    test7.setName("Lock Question Member without Group");
	    test7.setXmlClasses(classes7);
	    List<XmlSuite> suites7 = new ArrayList<XmlSuite>();
	    suites7.add(suite);
	    
	    List<XmlClass> classes8 = new ArrayList<XmlClass>();
	    classes8.add(new XmlClass("com.codetantra.testscripts.TS13ValidateFacultyUnLockSystem"));
	    XmlTest test8 = new XmlTest(suite);
	    test8.setName("Faculty UnLock Question");
	    test8.setXmlClasses(classes8);
	    List<XmlSuite> suites8 = new ArrayList<XmlSuite>();
	    suites8.add(suite);
	    
	    List<XmlClass> classes9 = new ArrayList<XmlClass>();
	    classes9.add(new XmlClass("com.codetantra.testscripts.TS14ValidateMultiLanguages"));
	    XmlTest test9 = new XmlTest(suite);
	    test9.setName("Multi Languages");
	    test9.setXmlClasses(classes9);
	    List<XmlSuite> suites9 = new ArrayList<XmlSuite>();
	    suites9.add(suite);
	    
	    List<XmlClass> classes10 = new ArrayList<XmlClass>();
	    classes10.add(new XmlClass("com.codetantra.testscripts.TS15ValidateStatisticsQuestionInMember"));
	    XmlTest test10 = new XmlTest(suite);
	    test10.setName("Statistics Question Member");
	    test10.setXmlClasses(classes10);
	    List<XmlSuite> suites10 = new ArrayList<XmlSuite>();
	    suites10.add(suite);
	    
	    
	    List<XmlClass> classes11 = new ArrayList<XmlClass>();
	    classes11.add(new XmlClass("com.codetantra.testscripts.TS16ValidateStatisticsQuestionInFaculty"));
	    XmlTest test11 = new XmlTest(suite);
	    test11.setName("Statistics Question Faculty");
	    test11.setXmlClasses(classes11);
	    List<XmlSuite> suites11 = new ArrayList<XmlSuite>();
	    suites11.add(suite);
	    
	    List<XmlClass> classes12 = new ArrayList<XmlClass>();
	    classes12.add(new XmlClass("com.codetantra.testscripts.TS17VerifyButtonsinEditor"));
	    XmlTest test12 = new XmlTest(suite);
	    test12.setName("Verify Button In Editor");
	    test12.setXmlClasses(classes12);
	    List<XmlSuite> suites12 = new ArrayList<XmlSuite>();
	    suites12.add(suite);
	    
		Set<Entry<Object, Object>>entrySet=CommonFunctions.readPropertyFile(Global.executeDirectory+"/config.properties");
		for(Entry<Object, Object> ent:entrySet)
		{
			if(ent.getKey().equals("driverpath")) {
				Global.sChromeDriverPathconfig= ent.getValue().toString();
			}
		}

	
	    TestNG testNG = new TestNG();
	    testNG.setXmlSuites(suites);
	    testNG.run();

	}

}
