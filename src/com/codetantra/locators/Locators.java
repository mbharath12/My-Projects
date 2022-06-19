package com.codetantra.locators;

import org.openqa.selenium.By;

public  class Locators {

	public static class Login{

		public static class TextBox{
			public static By userNameTextBox = By.xpath("//input[@id='loginId']");

			public static By passwordTextBox = By.xpath("//input[@id='password']");

		}
		public static class Button{
			public static By signInButton = By.xpath("//button[@id='loginBtn']");
			
			
		}
		
		public static class ErrorMessages{
			public static By requriedField = By.xpath("//label[text()='This field is required.']");
			public static By errormessage = By.xpath("//section[@id='alertify-logs']/article");
		}
	}

	public static class CommonLocators{
		
		public static class DropdownArrow{
			
			public static By taskbarArrow = By.xpath("//i[@class='fa fa-chevron-down ']");
			public static By scrolltoparrow = By.xpath("");
			
		}
		
		public static class Button{
			public static By logoutbutton = By.xpath("//span[@id='logoutBtn']");
			
		}
		
		public static class Label{
			public static By userNameLabel = By.xpath("//strong[@data-toggle='tooltip']");
			public static By coursestitle = By.xpath("//span[text()='Courses']");
			public static By homebutton = By.xpath("//span[normalize-space()='Home']");
		}
	}
	
	public static class RegisterUser{
		public static class Label{
			public static By registerWindowName = By.xpath("//h4[text()='Register New Users']|//h4[text()='Register New Bulk Faculties']");
			public static By existinguser = By.xpath("//h4[contains(text(),'Existing User(s) already present')] ");
		}
		
		public static class TextBox{
			public static By newUser = By.xpath("//textarea[@id='newUsers']");
		}
		
		public static class Button{
			public static By addbutton = By.xpath("//button[text()='Add']");
			public static By resetbutton = By.xpath("//button[text()='Reset']");
		}
		
		public static class Messages{
			public static By errorMessage = By.xpath("//article[contains(@class,'alertify-log-error')]");
			public static By successMessage = By.xpath("//article[contains(@class,'alertify-log-success')]");
		}
	}
	
	
	public static class DeleteUserfromGroup{

		public static class Button{
			public static By fetchUsers = By.xpath("//span[normalize-space()='Fetch Users']");
			public static By deleteButton = By.xpath("//span[normalize-space()='Delete Users']");
			public static By OKButton = By.xpath("//button[text()='OK']");
			public static By CancelButton = By.xpath("//button[text()='Cancel']");
			
		}
		public static class Label{
			public static By deleteUserWindow = By.xpath("//h4[text()='Delete User from Group']");
		}
	}
	
	public static class EditUser{
		public static class Label{
			public static By editUserWindow = By.xpath("//h4[text()='Edit User Details']");
		
		}
		public static class Button{
			public static By fetchUsers = By.xpath("//span[normalize-space()='Fetch Users']");
			public static By updateSelectedButton = By.xpath("//span[normalize-space()='Update Selected Users']");
			public static By OKButton = By.xpath("//button[text()='OK']");
			public static By CancelButton = By.xpath("//button[text()='Cancel']");
			
		}
	}
	
	
	public static class Groups{
		public static class TextBox{
            public static By startyear = By.xpath("//input[@name='startYear']");
            public static By endyear = By.xpath("//input[@id='endYear']");
            public static By department = By.xpath("//input[@id='department']");
            public static By section = By.xpath("//input[@id='section']");
            public static By suffix = By.xpath("//input[@id='suffix']");
            public static By description = By.xpath("//input[@id='description']");
            public static By searchbox = By.xpath("//input[@type='search']");
			
		}
		
		public static class Button{
			public static By forinterviewOn = By.xpath("//label[contains(@for,'Interview')]/..//div[contains(@class,'switch-on')]");
			public static By forinterviewOff = By.xpath("//label[contains(@for,'Interview')]/..//div[contains(@class,'switch-off')]");
			
			public static By defaultSignupGroupOn = By.xpath("//label[contains(@for,'Default')]/..//div[contains(@class,'switch-on')]");
			public static By defaultSignupGroupOff = By.xpath("//label[contains(@for,'Default')]/..//div[contains(@class,'switch-off')]");
			
			public static By enabledOn = By.xpath("//label[contains(@for,'Enabled')]/..//div[contains(@class,'switch-on')]");
			public static By enabledOff = By.xpath("//label[contains(@for,'Enabled')]/..//div[contains(@class,'switch-off')]");
			
			public static By addbutton = By.xpath("//button[text()='Add']");
			public static By resetbutton = By.xpath("//button[text()='Reset']");
			public static By updatebutton = By.xpath("//button[text()='Update']");
			
			
			public static By editbutton = By.xpath("//a[normalize-space()='Edit']");
			public static By clone = By.xpath("//a[normalize-space()='Clone']");
			
		}
		public static class Label{
			public static By groupheader = By.xpath("//h4[text()='Groups']");
		
		}
	}
	
	
	public static class BlockedUser{
		public static By blockedUserNameTextBox = By.xpath("//input[@id='loginId']");
		public static By blockedUserPasswordTextBox = By.xpath("//input[@id='password']");

	}

	public static class VerifyBlockedUser{
		public static By goToLogin = By.xpath("//b[text()='Go To Login']");
	}


	public static class PasswordRecovery {
		public static By requiredField = By.xpath("//label[text()='This field is required.']");
		public static By forgotPassword = By.xpath("//div[text()='Forgot']");
	}


	
	public static class Coursestatus 
	{
		//course icon 
		public static By courses_heading = By.xpath("//span[@id='courses']");
		public static By course_box =By.xpath("//div[@id='coursesBody']/div[contains(@class,'bs-callout bs-callout-success')]");
		public static By course_list = By.xpath("//div[@id='coursesBody']/div[contains(@class,'bs-callout bs-callout-success')]//..//h4");

		//Lesson body
		public static By Lessonbody = By.xpath("//div[@id='sectionBody']");
	
		//enables lessons
		public static By lesson_e = By.xpath("//a[@class='topicNameATag']");
		
		//List of lessons bar 
		public static By lessons_bar = By.xpath("//i[contains(@class,'badge')]");
		
		
	}
	
	public static class verifyJumpStatus {
		//course heading
		public static By coursesbody = By.xpath("//div[@id='coursesBody']");

		//MileStone2 Course
		public static By milestone2= By.xpath("//a[text()='Milestone 2']");

		//Coding unit
		public static By mcq = By.xpath("//a[text()='MCQ']']");

		//SubUnit MCMA
		public static By subunitMCMA = By.xpath("//h4[normalize-space(text())='MCMA']");

		//SubUnit Question
		public static By question = By.xpath("//span[@subunitname='MCMA' and @qcount='1']");

		//Quick Access Slider Panel
		public static By sliderPanel = By.xpath("//div[@id='quickQAccessTrapezoidSlider']");

		//jump to another question in slider panel
		public static By jumpedQuestion = By.xpath("//div[@id='quickQAccessSliderPanel']//span[@qcount='3']");

		//Jumped Question
		public static By jumpQuestionStatus = By.xpath("//li[@id='modalQNoHeading']");

		//Close Quick Access Slider Panel
		public static By closeSliderPanel = By.xpath("//div[text()='Close x']");

		//Verify same Question is visible After double click in slider panel
		public static By sameQuestion = By.xpath("//li[@id='modalQNoHeading']");
	
		//Close Question
		public static By close = By.xpath("//div[@class='modal-header questionDialogHeader']/.//span[text()='Close']");
	}
	
	
	public static class question
	{
		public static By question_reset = By.xpath("//span[text()='Reset']");
		public static By question_submit = By.xpath("//span[text()='Submit']");
		public static By question_close = By.xpath("//span[@title='Close']");
		public static By question_1_MCMA = By.xpath("//div[@id='sectionBody']//following-sibling::h4[contains(text(),'MCMA')]/span//following::li[1]/div[@class='questionsArea']/span[1]");
		public static By question_2_MCMA = By.xpath("//div[@id='sectionBody']//following-sibling::h4[contains(text(),'MCMA')]/span//following::li[1]/div[@class='questionsArea']/span[2]");
		public static By question_3_MCMA = By.xpath("//div[@id='sectionBody']//following-sibling::h4[contains(text(),'MCMA')]/span//following::li[1]/div[@class='questionsArea']/span[3]");
		public static By quesstion_1_MCSA = By.xpath("//div[@id='sectionBody']//following-sibling::h4[contains(text(),'MCSA')]/span//following::li[1]/div[@class='questionsArea']/span[1]");
	}

	
	
	public static class Validateterminal
    {
        //course heading
        public static By coursesbody = By.xpath("//div[@id='coursesBody']");

        //MileStone2 Course
        public static By milestone2= By.xpath("//a[text()='Milestone 2']");

        //Unit body
        public static By unitbody = By.xpath("//div[@id='sectionBody']/div");

        //Coding unit
        public static By coding = By.xpath("//a[text()='Coding']");

        //SubUnit panel heading
        public static By subunitpanelheading = By.xpath("//div[@id='sectionBody']");

        //Sub Unit List
        public static By subunitlist = By.xpath("//div[@class='bs-callout-body']/h4");

        //Sub unit CErrjava
        public static By javacerr = By.xpath("//span[@subunitname='CErr Java' and @qcount='1']");

        //submit
        public static By submit = By.xpath("//span[text()='Submit']");

        
    }
	
	
	public static class CompilationErrors 
	{
		//Scroll option
		public static By scrollEditor = By.xpath("//label[text()='Correct/Complete the Code :']");

		//Next button
		public static By nextbutton = By.xpath("//span[text()='Next >> ']");

		//submit button
		public static By submitbutton = By.xpath("//span[text()='Submit']");

		//Close Icon for question
		public static By closeIcon = By.xpath("//span[@class='btn btn-xs btn-danger']");

		//Compilation Error message while click on submit without modifying editor
		public static By compilationerrorlist = By.xpath("//h4[text()='Compilation Errors']");

		//Test case ERROR  List
		public static By testcaseerrorlist = By.xpath("//h3[text()='Execution Results']");

		//Successful submit message
		public static By successfullsubmitmessage = By.xpath("//article[text()='Successfully submitted the question.']");

		//Sub Unit List
		public static By subunitlist = By.xpath("//div[@id='sectionBody']//following-sibling::h4[contains(text(),'C')]/span//following::li/div[@class='questionsArea']/span[1]");

		//subunit question
		public static By subunitquestion = By.xpath("//div[@id='sectionBody']//following-sibling::h4[contains(text(),'C')]/span//following::li[1]/div[@class='questionsArea']/span[1]");

		//Correct/Complete the Code :
		public static By completetheCodelabel = By.xpath("//label[text()='Correct/Complete the Code :']");

		//CerrMulti Language Question
		public static By cerrmultiquestion = By.xpath("//div[@id='sectionBody']//div[5]//div//div//div//span[1]");
		
		//CerrMulti Language new Question
		public static By cerrnewquestion = By.xpath("//div[@id='sectionBody']//div[5]//div//div//div//span[2]");
		
		//Language filename
		public static By languagefilename = By.xpath("//div[@class='pull-left']/ul/li/a/input[@class='compilationErrorFileName']");

		//MultiLang drop down
		public static By seleclangtdropdown = By.xpath("//select[@class='form-control input-sm']");

		//Reset button
		public static By resetbutton = By.xpath("//span[text()='Reset']"); 

		//Alert box When we change language 
		public static By alertboxafterlanguagechange = By.xpath("//article[@class='alertify-inner']");

		//Alert Yes option
		public static By alertyes = By.xpath("//button[text()='Yes']");

		//Alert No option
		public static By alertno = By.xpath("//button[text()='No']");
		
		//Execution results
		public static By executionresults = By.xpath("//h3[text()='Execution Results']");
		
		//Spinner 
		public static By spinner = By.xpath("//div[@id='compilationProgressDiv2'][@style='display: block;']");
		
		//Close Icon
		public static By closeicon = By.xpath("//span[@onclick='closeClicked()']");
		
		//All test cases success message
		public static By alltestcasesuccess = By.xpath("//span[text()=' - All test cases have succeeded!']");
		
		//Terminal in multi language
		public static By terminalinmultilanguage= By.xpath("//div[contains(@class,'terminal xterm')]");
		
		//Question evalation
		public static By questionevaluation = By.id("evalForm");
		
		//filename of multi language
		public static By filenameofmultilanguage = By.xpath("//div[contains(@id,'compilationErrorEditor')][@filename]");
		
	}

	public static class FacultyLockSystem 
	{
		//Role Drop down
		public static By roledropdown = By.xpath("//i[@class='fa fa-user dropdown-toggle']");

		//course heading 
		public static By coursesbody = By.xpath("//div[@id='coursesBody']");

		//MileStone2 Course 
		public static By milestone2= By.xpath("//a[text()='Milestone 2']");

		//Unit body
		public static By unitbody = By.xpath("//div[@id='sectionBody']/div");

		//Coding unit
		public static By coding = By.xpath("//a[text()='Coding']");

		//SubUnit panel heading
		public static By subunitpanelheading = By.xpath("//div[@class='panel-heading']");

		//Sub Unit List
		public static By subunitlist = By.xpath("//div[@id='sectionBody']//h4");

		//Sub unit CErrjava
		//public static By javacerr = By.xpath("//div[@class='bs-callout-body']/h4[text()='CErr Java			']");

		//Sub unit CErrjava question
		public static By cerrjavaquestion=By.xpath("//span[@subunitname='CErr Java']");

		//CErrjava question quick access slider
		public static By cerrjavaquestionquickaccessslider = By.xpath("//div[@id='quickQAccessTrapezoidSlider']");

		//Group Text box 
		public static By grouptextbox= By.xpath("//input[@id='s2id_autogen1']");

		//faculty Unlock Image Icon 
		public static By facultyunlockimageicon = By.xpath("//img[@id='unlock']"); 

		//faculty lock Image Icon 
		public static By facultylockedimageicon = By.xpath("//img[@id='lock']");

		//Faculty Lock successful message
		public static By facultylocksuccessmessage = By.xpath("//article[text()='Successfully locked the selected question.']");

		//faculty Lock unsuccessful message
		public static By facultylockunsuccessmessage = By.xpath("//article[text()='Please select the group']");

		//faculty Unlock successful message
		public static By unlocksuccessmessage = By.xpath("//article[text()='Successfully unlocked the question!']");

		//Member lock image  
		public static By memberlockimage = By.xpath("//img[@src='/images/lock.png']");

		// Member lock message
		public static By memberlockmessage = By.xpath("//article[text()='Faculty/Instructor has locked the question. It cannot be closed until it is unlocked.']");
		
		
	}
	
	
	
	
	
	
	
	
}
