
package com.codetantra.lib;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;

import com.codetantra.locators.Locators;
import com.codetantra.variables.Constants;
import com.codetantra.variables.Global;
import com.data.framework.lib.Alerts;
import com.data.framework.lib.Browser;
import com.data.framework.lib.Elements;
import com.data.framework.lib.Messages;
import com.data.framework.lib.UserActions;
import com.data.framework.lib.Verify;
import com.data.framework.lib.Wait;

public class ApplicationFunctions {
	public static boolean bStatus;
	public static boolean clickFlag;

	// This method is used to login to application
	public static boolean loginToApplication(Map<String, String> maplogin) {

		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Login.TextBox.userNameTextBox, Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: User Name Text box is Not Visible ]";
				return false;
			}

			bStatus = Elements.clearText(Global.driver, Locators.Login.TextBox.userNameTextBox);
			if (maplogin.get("User Name") != null && !maplogin.get("User Name").isEmpty()) {
				bStatus = Elements.enterText(Global.driver, Locators.Login.TextBox.userNameTextBox, maplogin.get("User Name"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR :: User Name-" + maplogin.get("User Name") + " is Not Enter in User Name Text box ]";
					return false;
				}
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Login.TextBox.passwordTextBox, Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Password Text box is Not Visible ]";
				return false;
			}
			bStatus = Elements.clearText(Global.driver, Locators.Login.TextBox.passwordTextBox);

			if (maplogin.get("Password") != null && !maplogin.get("Password").isEmpty()) {
				bStatus = Elements.enterText(Global.driver, Locators.Login.TextBox.passwordTextBox, maplogin.get("Password"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR :: Password " + maplogin.get("Password") + " is Not Enter in Password Text box ]";
					return false;
				}
			}
			bStatus = Elements.click(Global.driver, Locators.Login.Button.signInButton);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Login button is not clicked]";
				return false;
			}

			bStatus = Verify.verifyElementVisible(Global.driver, Locators.Login.ErrorMessages.requriedField);
			if (bStatus) {
				Messages.errorMsg = "[ ERROR :: Please fill the Required mandatory fields ]";
				return false;
			}
			bStatus = Verify.verifyElementVisible(Global.driver, Locators.Login.ErrorMessages.errormessage);
			if (bStatus) {
				Messages.errorMsg = "[ ERROR :: Please check your User Name/ Password]";
				return false;
			}

			if (maplogin.get("Blocked User") != null && maplogin.get("Blocked User").equalsIgnoreCase("Yes")) {
				bStatus = Wait.waitForElementVisibility(Global.driver, Locators.VerifyBlockedUser.goToLogin, Constants.fiveSeconds);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Blocked Pop-up window is not present after waiting 5 sec]";
					return false;
				}
				Browser.reloadPage(Global.driver);
				return true;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Button.logoutbutton, Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Unable to Login in to Appication]";
				return false;
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to Log out the Application
	public static boolean logoutFromApplication() {
		try {
			if (Global.logInStatus) {
				// Click on Logged in user name to expand menus

				bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Button.logoutbutton, Constants.lTimeOut);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR:: Log Out Button is not available.]";
					return false;
				}
				bStatus = CommonFunctions.jsClick(Locators.CommonLocators.Button.logoutbutton);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR:: Cannot click on Log Out Button.]";
					return false;
				}

				/*
				 * // Accept the alert to Log Out Confirmation bStatus =
				 * Verify.verifyAlertPresent(Global.driver); if(bStatus) { bStatus =
				 * Alerts.acceptAlert(Global.driver); if(!bStatus) { Messages.errorMsg =
				 * "[ERROR:: Unable to accept the alert.]"; return false; } }
				 */
				// Wait for the User name text box until 30 seconds
				bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Login.Button.signInButton, Constants.thirtySeconds);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR::After Click on log out button, application is not navigating to Login page after " + Constants.lTimeOut + " seconds waiting time.]";
					return false;
				}
				return true;
			} else
				return true;
		} catch (Exception e) {
			Messages.errorMsg = "[ERROR:: Exception Raise in logout From Application keyword.]";
			return false;
		}
	}

	// This method is used to navigate to sub menu
	public static boolean navigateToSubMenu(String sMenu, String sSubMenu) {
		try {
			bStatus = CommonFunctions.spinnerClick(Global.driver, Locators.CommonLocators.Label.userNameLabel);
			sMenu = sMenu.trim();
			sSubMenu = sSubMenu.trim();

			String menuloc = "//span[text()='" + sMenu + "']| //span[normalize-space()='" + sMenu + "']";

			String sSubMenuLocator = "//span[text()='" + sMenu + "'] //ancestor::li//a[text()='" + sSubMenu + "']| //span[normalize-space()='" + sMenu + "']//ancestor::li//a[normalize-space()='" + sSubMenu + "']";

			By objMenuLocator = By.xpath(menuloc);

			// String sSubMenuLocator =
			// "//span[text()='"+sMenu+"//ancestor::li//a[text()='"+sSubMenu+"']|
			// //span[normalize-space()='"+sMenu+"']//ancestor::li//a[text()='"+sSubMenu+"']";

			By objSubMenuLocator = By.xpath(sSubMenuLocator);

			bStatus = Wait.waitForElementVisibility(Global.driver, objMenuLocator, Constants.lTimeOut);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR::'" + sMenu + "' menu is not displayed on the page.]";
				return false;
			}
			for (int i = 0; i < 3; i++) {
				bStatus = UserActions.mouseOver(Global.driver, objMenuLocator);
				if (!bStatus)
					continue;
				if (bStatus)
					break;
			}
			if (!bStatus) {
				Messages.errorMsg = "[ERROR:: Cannot mouseover on '" + sMenu + "' menu. Please have look.]";
				return false;
			}

			if (!sMenu.equalsIgnoreCase("Home")) {
				bStatus = Elements.click(Global.driver, objMenuLocator);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR:: " + sMenu + " is not clicked.]";
					return false;
				}
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, objSubMenuLocator, Constants.lTimeOut);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR:: " + sMenu + " is not displayed on the page.]";
				return false;
			}
			bStatus = Elements.click(Global.driver, objSubMenuLocator);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR::'" + sSubMenu + "' SubMenu Not Clicked.Please have look.]";
				return false;
			}

			bStatus = CommonFunctions.spinnerClick(Global.driver, Locators.CommonLocators.Label.userNameLabel);

			return bStatus;
		} catch (Exception e) {
			Messages.errorMsg = "[ERROR:: Exception raised in navigate to sub menu keyword.]";
			return false;
		}
	}

	// Spinner Click
	private static boolean spinnerClick(WebDriver wDriver, By objLocator) {
		try {
			int iValue = 0;
			while (iValue < Constants.iSpinnerTime) {
				bStatus = Elements.click(wDriver, objLocator);
				if (bStatus) {
					return true;
				}
				iValue++;
				Thread.sleep(1000);
			}
			Messages.errorMsg = "[ERROR:: Spinner is still Displayed.]";
			return false;
		} catch (Exception e) {

			return false;
		}
	}

	// This Method is used to Select Role
	public static boolean doSelectRole(String roleName) {

		try {

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//i[@class='fa fa-user dropdown-toggle']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Role Add arrow button is not visible ]";
				return false;
			}

			bStatus = Elements.click(Global.driver, By.xpath("//i[@class='fa fa-user dropdown-toggle']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Role Add arrow button is not clicked ]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//a[normalize-space()='" + roleName + "']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: " + roleName + " is not visible in Menu ]";
				return false;
			}

			bStatus = Elements.click(Global.driver, By.xpath("//a[normalize-space()='" + roleName + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: " + roleName + " is not clicked ]";
				return false;
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to select value from drop down box
	public static boolean selectDropDownOfApplication(String sDropDownName, By dropDownArrow, String sLocator, String sDropDownValue) {
		try {
			By seletDropDownValueLocator = By.xpath(sLocator.replace("selectDropDownValue", sDropDownValue));
			By lookingForLocator = By.xpath("//div[@class='select2-search']/input");

			bStatus = ApplicationFunctions.spinnerClick(Global.driver, dropDownArrow);
			if (!bStatus) {
				Messages.errorMsg = "Search dropdown Wasn't Clickable";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, lookingForLocator, Constants.twoSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR:: Looking For Locator is not available.]";
				return false;
			}
			bStatus = CommonFunctions.enteTextAndPressEnterKeyUsingActions(Global.driver, lookingForLocator, sDropDownValue.trim());
			if (!bStatus)
				return false;
			bStatus = Wait.waitForElementVisibility(Global.driver, seletDropDownValueLocator, Constants.lTimeOut);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR::" + sDropDownValue + " is not visible in the dropdown field]";
				return false;
			}
			bStatus = CommonFunctions.mouseOver(Global.driver, seletDropDownValueLocator);
			if (!bStatus)
				return false;
			// Click on drop down value locator to select
			bStatus = Elements.click(Global.driver, seletDropDownValueLocator);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR::" + sDropDownValue + "is not clicked in dropdown.]";
				return false;
			}
			// Wait until spinner image is in invisibility

			bStatus = CommonFunctions.waitForElementInvisibility(lookingForLocator, Constants.lTimeOut);
			if (!bStatus)
				return false;
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to Register New user/ Register New Bulk Faculties
	public static boolean doRegisterNewUser(Map<String, String> mapNewUser) {

		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.RegisterUser.Label.registerWindowName, Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Register pop up is Not visible after waiting 60 sec]";
				return false;
			}

			bStatus = ApplicationFunctions.selectDropDownOfApplication("Select Group", By.xpath("//span[text()='Select Group']"), "//div/span[text()='selectDropDownValue']", mapNewUser.get("GroupName"));
			if (!bStatus) {
				return false;
			}

			if (mapNewUser.get("New Users") != null && !mapNewUser.get("New Users").isEmpty()) {
				bStatus = Elements.enterText(Global.driver, Locators.RegisterUser.TextBox.newUser, mapNewUser.get("New Users"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Text is not entered in New Users text box]";
					return false;
				}
			}

			bStatus = Elements.click(Global.driver, Locators.RegisterUser.Button.addbutton);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Add  Button is not clicked]";
				return false;
			}

			bStatus = Verify.verifyElementVisible(Global.driver, Locators.RegisterUser.Messages.errorMessage);
			if (bStatus) {
				Messages.errorMsg = "[ERROR :: User details are not Added]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.RegisterUser.Messages.successMessage, Constants.fiveSeconds);
			if (!bStatus) {
				bStatus = Verify.verifyElementVisible(Global.driver, Locators.RegisterUser.Label.existinguser);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Existing User(s) already present]";
					return false;
				}
				Messages.errorMsg = "[ERROR :: User deatils are not Added]";
				return false;
			}
			return true;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}

	}

	// This method is used to delete User/Faculties
	public static boolean doDeleteUser(Map<String, String> mapdeleteuser) {

		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.DeleteUserfromGroup.Label.deleteUserWindow, Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Delete User from Group popup is not visible after waiting 60 sec]";
				return false;
			}

			bStatus = ApplicationFunctions.selectDropDownOfApplication("Select Group", By.xpath("//span[text()='Select Group']"), "//div/span[text()='selectDropDownValue']", mapdeleteuser.get("GroupName"));
			if (!bStatus) {
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.DeleteUserfromGroup.Button.fetchUsers, Constants.sixtySeconds);

			bStatus = Elements.click(Global.driver, Locators.DeleteUserfromGroup.Button.fetchUsers);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Fetch User button is not clicked]";
				return false;
			}

			bStatus = Verify.verifyElementVisible(Global.driver, Locators.RegisterUser.Messages.errorMessage);
			if (bStatus) {
				Messages.errorMsg = "[ERROR :: User details are not Fetched]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.RegisterUser.Messages.successMessage, Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: User details are not Fetched]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElement(Global.driver, By.xpath("//td[text()='" + mapdeleteuser.get("DeleteUser") + "']/..//input"));
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Unable to scroll to view -" + mapdeleteuser.get("DeleteUser") + " ]";
				return false;
			}

			bStatus = Elements.click(Global.driver, By.xpath("//td[text()='" + mapdeleteuser.get("DeleteUser") + "']/..//input"));
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: " + mapdeleteuser.get("DeleteUser") + "  check box is not clicked]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.DeleteUserfromGroup.Button.deleteButton);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Unable to scroll to view - delete button ]";
				return false;
			}

			bStatus = Elements.click(Global.driver, Locators.DeleteUserfromGroup.Button.deleteButton);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Delete button is not clicked]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.DeleteUserfromGroup.Button.OKButton, Constants.thirtySeconds);
			bStatus = Elements.click(Global.driver, Locators.DeleteUserfromGroup.Button.OKButton);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: OK button is not clicked]";
				return false;
			}

			bStatus = Verify.verifyElementVisible(Global.driver, Locators.RegisterUser.Messages.errorMessage);
			if (bStatus) {
				Messages.errorMsg = "[ERROR :: User deatils are not Deleted]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.RegisterUser.Messages.successMessage, Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: User deatils are not Deleted]";
				return false;
			}

			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public static boolean doEditUser(Map<String, String> mapEditUser) {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.EditUser.Label.editUserWindow, Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Delete User from Group popup is not visible after waiting 60 sec]";
				return false;
			}

			bStatus = ApplicationFunctions.selectDropDownOfApplication("Select Group", By.xpath("//span[text()='Select Group']"), "//div/span[text()='selectDropDownValue']", mapEditUser.get("GroupName"));
			if (!bStatus) {
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.EditUser.Button.fetchUsers, Constants.sixtySeconds);

			bStatus = Elements.click(Global.driver, Locators.EditUser.Button.fetchUsers);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Fetch User button is not clicked]";
				return false;
			}

			bStatus = Verify.verifyElementVisible(Global.driver, Locators.RegisterUser.Messages.errorMessage);
			if (bStatus) {
				Messages.errorMsg = "[ERROR :: User details are not Fetched]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.RegisterUser.Messages.successMessage, Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: User details are not Fetched]";
				return false;
			}

			bStatus = Elements.enterText(Global.driver, By.xpath("//input[@type='search']"), mapEditUser.get("EditUser"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: " + mapEditUser.get("EditUser") + " is not entered in search box]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElement(Global.driver, By.xpath("//td[text()='" + mapEditUser.get("EditUser") + "']/preceding-sibling::td//input"));
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Unable to scroll to view -" + mapEditUser.get("EditUser") + " ]";
				return false;
			}

			bStatus = Elements.click(Global.driver, By.xpath("//td[text()='" + mapEditUser.get("EditUser") + "']/preceding-sibling::td//input"));
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: " + mapEditUser.get("EditUser") + "  check box is not clicked]";
				return false;
			}

			// Enter First Name
			bStatus = Elements.enterText(Global.driver, By.xpath("//td[text()='" + mapEditUser.get("EditUser") + "']/following-sibling::td[1]//input"), "XYZ");
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: First Name is not Entered]";
				return false;
			}

			bStatus = Elements.enterText(Global.driver, By.xpath("//td[text()='" + mapEditUser.get("EditUser") + "']/following-sibling::td[2]//input"), "abc");
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Last Name is not Entered]";
				return false;
			}

			bStatus = Elements.enterText(Global.driver, By.xpath("//td[text()='" + mapEditUser.get("EditUser") + "']/following-sibling::td[4]//input"), "1990/01/01");
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: DOB is not Entered]";
				return false;
			}

			bStatus = Elements.enterText(Global.driver, By.xpath("//td[text()='" + mapEditUser.get("EditUser") + "']/following-sibling::td[5]//input"), "1234567898");
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Phone Number is not Entered]";
				return false;
			}

			bStatus = Elements.enterText(Global.driver, By.xpath("//td[text()='" + mapEditUser.get("EditUser") + "']/following-sibling::td[6]//input"), "1234567898");
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Reg/ID number  is not Entered]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.EditUser.Button.updateSelectedButton);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Unable to scroll to view - Update Selected Users ]";
				return false;
			}

			bStatus = Elements.click(Global.driver, Locators.EditUser.Button.updateSelectedButton);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: Update Selected Users  button is not Clicked]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.EditUser.Button.OKButton, Constants.thirtySeconds);
			bStatus = Elements.click(Global.driver, Locators.EditUser.Button.OKButton);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: OK button is not clicked]";
				return false;
			}

			bStatus = Verify.verifyElementVisible(Global.driver, Locators.RegisterUser.Messages.errorMessage);
			if (bStatus) {
				Messages.errorMsg = "[ERROR :: User deatils are not Deleted]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.RegisterUser.Messages.successMessage, Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: User deatils are not Deleted]";
				return false;
			}
			System.out.println();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public static boolean doGroupFunctionlaity(Map<String, String> mapgroup) {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Groups.Label.groupheader, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR:: Group popup window is not displayed after waiting 30 sec]";
				return false;
			}
			if (mapgroup.get("Group Operation") != null & (mapgroup.get("Group Operation").equalsIgnoreCase("Edit") | mapgroup.get("Group Operation").equalsIgnoreCase("Clone"))) {
				bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.Groups.TextBox.searchbox);
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR :: Not able to scroll to view Search box]";
					return false;
				}

				if (mapgroup.get("GroupName") != null) {
					bStatus = Elements.enterText(Global.driver, Locators.Groups.TextBox.searchbox, mapgroup.get("GroupName"));
					if (!bStatus) {
						Messages.errorMsg = "[ ERROR :: Text is not Enter in Search box]";
						return false;
					}

					if (mapgroup.get("Group Operation").equalsIgnoreCase("Edit")) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.editbutton);
						if (!bStatus) {
							Messages.errorMsg = "[ ERROR :: Edit button is not clicked]";
							return false;
						}
					}
					if (mapgroup.get("Group Operation").equalsIgnoreCase("Clone")) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.clone);
						if (!bStatus) {
							Messages.errorMsg = "[ ERROR :: Clone button is not clicked]";
							return false;
						}
					}
				}
			}

			if (mapgroup.get("Start Year") != null) {
				bStatus = Elements.enterText(Global.driver, Locators.Groups.TextBox.startyear, mapgroup.get("Start Year"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR:: " + mapgroup.get("Start Year") + " is not enterd in Start Year text box ]";
					return false;
				}
			}
			if (mapgroup.get("End Year") != null) {
				bStatus = Elements.enterText(Global.driver, Locators.Groups.TextBox.endyear, mapgroup.get("End Year"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR:: " + mapgroup.get("End Year") + " is not enterd in End Year text box ]";
					return false;
				}
			}

			if (mapgroup.get("Department") != null) {
				bStatus = Elements.enterText(Global.driver, Locators.Groups.TextBox.department, mapgroup.get("Department"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR:: " + mapgroup.get("Department") + " is not entered in Department text box ]";
					return false;
				}
			}

			if (mapgroup.get("Section") != null) {
				bStatus = Elements.enterText(Global.driver, Locators.Groups.TextBox.section, mapgroup.get("Section"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR:: " + mapgroup.get("Section") + " is not entered in Section text box ]";
					return false;
				}
			}

			if (mapgroup.get("Suffix") != null) {
				bStatus = Elements.enterText(Global.driver, Locators.Groups.TextBox.suffix, mapgroup.get("Suffix"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR:: " + mapgroup.get("Suffix") + " is not entered in Suffix text box ]";
					return false;
				}
			}

			if (mapgroup.get("Description") != null) {
				bStatus = Elements.enterText(Global.driver, Locators.Groups.TextBox.description, mapgroup.get("Description"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR:: " + mapgroup.get("Description") + " is not entered in Description text box ]";
					return false;
				}
			}

			if (mapgroup.get("For Interview") != null) {

				if (mapgroup.get("For Interview").equalsIgnoreCase("Yes")) {
					bStatus = Verify.verifyElementVisible(Global.driver, Locators.Groups.Button.forinterviewOn);
					if (!bStatus) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.forinterviewOff);
						if (!bStatus) {
							Messages.errorMsg = "[ERROR :: For Interview Yes button is not clicked]";
							return false;
						}
					}
				}
				if (mapgroup.get("For Interview").equalsIgnoreCase("No")) {
					bStatus = Verify.verifyElementVisible(Global.driver, Locators.Groups.Button.forinterviewOff);
					if (!bStatus) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.forinterviewOn);
						if (!bStatus) {
							Messages.errorMsg = "[ERROR :: For Interview No button is not clicked]";
							return false;
						}
					}
				}
			}

			if (mapgroup.get("Default Signup-Group") != null) {
				if (mapgroup.get("Default Signup-Group").equalsIgnoreCase("Yes")) {
					bStatus = Verify.verifyElementVisible(Global.driver, Locators.Groups.Button.defaultSignupGroupOn);
					if (!bStatus) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.defaultSignupGroupOff);
						if (!bStatus) {
							Messages.errorMsg = "[ERROR :: Default Signup-Group Yes button is not clicked]";
							return false;
						}
					}
				}
				if (mapgroup.get("Default Signup-Group").equalsIgnoreCase("No")) {
					bStatus = Verify.verifyElementVisible(Global.driver, Locators.Groups.Button.defaultSignupGroupOff);
					if (!bStatus) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.defaultSignupGroupOn);
						if (!bStatus) {
							Messages.errorMsg = "[ERROR :: Default Signup No button is not clicked]";
							return false;
						}
					}
				}
			}
			if (mapgroup.get("Enabled") != null) {
				if (mapgroup.get("Enabled").equalsIgnoreCase("Yes")) {
					bStatus = Verify.verifyElementVisible(Global.driver, Locators.Groups.Button.enabledOn);
					if (!bStatus) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.enabledOff);
						if (!bStatus) {
							Messages.errorMsg = "[ERROR :: Enabled Yes button is not clicked]";
							return false;
						}
					}
				}
				if (mapgroup.get("Enabled").equalsIgnoreCase("No")) {
					bStatus = Verify.verifyElementVisible(Global.driver, Locators.Groups.Button.enabledOff);
					if (!bStatus) {
						bStatus = Elements.click(Global.driver, Locators.Groups.Button.enabledOn);
						if (!bStatus) {
							Messages.errorMsg = "[ERROR :: Enabled No button is not clicked]";
							return false;
						}
					}
				}
			}
			if (mapgroup.get("Group Operation") != null & mapgroup.get("Group Operation").equalsIgnoreCase("Edit")) {
				bStatus = Elements.click(Global.driver, Locators.Groups.Button.updatebutton);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Update button is not clicked]";
					return false;
				}
			} else {
				bStatus = Elements.click(Global.driver, Locators.Groups.Button.addbutton);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Add button is not clicked]";
					return false;
				}
			}

			bStatus = Verify.verifyElementVisible(Global.driver, Locators.RegisterUser.Messages.errorMessage);
			if (bStatus) {
				Messages.errorMsg = "[ERROR :: User deatils are not Deleted]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.RegisterUser.Messages.successMessage, Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: User deatils are not Deleted]";
				return false;
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to verify a Expire courses
	public static boolean doValidateExpiredCourses() {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
				return false;
			}

			int expiredCoursesCount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='coursesBody']/div[contains(@class,'text-muted')]//div//strong[text()='Expired']"));
			if (expiredCoursesCount == 0) {
				Messages.errorMsg = "[ERROR ::No Expired Courses are availble]";
				return false;
			}
			for (int i = 1; i <= expiredCoursesCount; i++) {
				if (i > 3) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']/div[contains(@class,'text-muted')][" + i + "]//div//strong[text()='Expired']"));
				}
				bStatus = Elements.click(Global.driver, By.xpath("//div[@id='coursesBody']/div[contains(@class,'text-muted')][" + i + "]//div//strong[text()='Expired']/../../../..//h4"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::Not able to click on course title]";
					return false;
				}
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='sectionBody']"));
				if (bStatus) {
					Messages.errorMsg = "[ERROR :: Able to access Expired courses]";
					return false;
				}

				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div[contains(@class,'text-muted')][" + i + "]//div//strong[text()='Expired']/ancestor::h3/following-sibling::div/a"));
				if (bStatus) {
					bStatus = Elements.click(Global.driver, By.xpath("//div[@id='coursesBody']/div[contains(@class,'text-muted')][" + i + "]//div//strong[text()='Expired']/ancestor::h3/following-sibling::div/a"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Buy button is not clicked]";
						return false;
					}
					bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//h3[text()='Order Summary']"), Constants.thirtySeconds);
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Order Summary Page is not visible]";
						return false;
					}
					Browser.navigateBack(Global.driver);
					// CommonFunctions.threadSleep(1);
					bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
					if (!bStatus) {
						Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
						return false;
					}
					// CommonFunctions.threadSleep(1);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to verify Course Title and description
	public static boolean doVerifyCourseTitleandDes() {

		try {

			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
				return false;
			}

			int courseno = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='coursesBody']/div"));
			if (courseno == 0) {
				Messages.errorMsg = "[ERROR ::No Courses are available/check your locator]";
				return false;
			}

			for (int i = 1; i <= courseno; i++) {
				if (i > 3) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//h4 "));
					if (bStatus) {
						System.out.println("***Scrolled To web Element***********************");
					}

				}
				// verify Course Title
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//h4"));
				if (bStatus) {
					String courseTiltle = Elements.getText(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//h4"));
					if (courseTiltle == null || courseTiltle.isEmpty()) {
						Messages.errorMsg = "[ERROR ::Courses Title is not available]";
						return false;
					}
					System.out.println("courseTiltle-" + courseTiltle);
				}

				// Verify course description
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//p"));
				if (bStatus) {
					String coursedescription = Elements.getText(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//p"));
					if (coursedescription == null || coursedescription.isEmpty()) {
						Messages.errorMsg = "[ERROR ::Courses description is not available]";
						return false;
					}
					System.out.println("description-" + coursedescription);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to verify sequence courses.
	public static boolean doVerifySequenceCources(Map<String, String> mapseqcources) {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']/div//a[text()='" + mapseqcources.get("Course Name") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to Scroll to view " + mapseqcources.get("Course Name") + "]";
				return false;
			}

			bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div//a[text()='" + mapseqcources.get("Course Name") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: " + mapseqcources.get("Sequence Course") + " is not visible]";
				return false;
			}

			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='coursesBody']/div//a[text()='" + mapseqcources.get("Course Name") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to Click on Courses- " + mapseqcources.get("Course Name") + "']";
				return false;
			}

			bStatus = doValiadateLessonSeq();
			if (!bStatus) {
				return false;
			}

			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public static boolean doValiadateLessonSeq() {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='sectionBody']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
				return false;
			}
			int lessoncount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div"));
			for (int i = 1; i <= lessoncount; i++) {
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + i + "]//a[@class='topicNameATag']"));
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + i + "]//a[@class='topicNameATag']"));
				if (bStatus) {
					continue;
				} else {


				}
				break;
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to validate Random Courses
	public static boolean doValiadteRandomCources(Map<String, String> mapCoursesDetails) {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
				return false;
			}
			if (mapCoursesDetails.get("Courses") != null && !mapCoursesDetails.isEmpty()) {
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']/div//a[text()='" + mapCoursesDetails.get("Courses") + "']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Not able to Scroll to view " + mapCoursesDetails.get("Courses") + "]";
					return false;
				}

				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div//a[text()='" + mapCoursesDetails.get("Courses") + "']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: " + mapCoursesDetails.get("Courses") + " is not visible]";
					return false;
				}

				bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='coursesBody']/div//a[text()='" + mapCoursesDetails.get("Courses") + "']"));
				// bStatus = Elements.click(Global.driver,
				// By.xpath("//div[@id='coursesBody']/div//a[text()='"+mapseqcources.get("SCourses")+"']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Not able to Click on Courses- " + mapCoursesDetails.get("Courses") + "']";
					return false;
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		return true;
	}

	public static boolean doValidateLessons() {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='sectionBody']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
				return false;
			}
			int lessoncount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div"));
			for (int i = 1; i <= lessoncount; i++) {

				bStatus = CommonFunctions.scrollToWebElement(Global.driver, By.xpath("//div[@id='sectionBody']//a[text()='L" + i + "']"));
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='sectionBody']//a[text()='L" + i + "']"));
				if (bStatus) {
					bStatus = Elements.click(Global.driver, By.xpath("//div[@id='sectionBody']//a[text()='L" + i + "']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Lesson -L" + i + " is not clicked]";
						return false;
					}
					bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//button[contains(text(),'Learn')]"), Constants.fiveSeconds);
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Lesson -L" + i + " details are not displayed after click on Lesson -L" + i + "]";
						return false;
					}
					CommonFunctions.threadSleep(1);
					bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//a[@id='courseATag']"));

					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Please check your Course Tag Locator]";
						return false;
					}
					bStatus = CommonFunctions.jsClick(By.xpath("//a[@id='courseATag']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR ::Course Tag is not Clicked]";
						return false;
					}
					bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='sectionBody']"), Constants.thirtySeconds);
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
						return false;
					}
					i = i + 2;
				} else {
					Messages.errorMsg = "[ERROR :: Lesson -L" + i + " is not enabled]";
					return false;
				}
			}
			return true;
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}

	// This method is used to verify forget Password Recovery
	public static boolean doValiadteforgotPassword() {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Login.TextBox.userNameTextBox, Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: User Name Text box is Not Visible ]";
				return false;
			}

			bStatus = Verify.verifyElementPresent(Global.driver, Locators.PasswordRecovery.forgotPassword);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Please check your Locator for forgot password]";
				return false;
			}
			bStatus = Elements.click(Global.driver, Locators.PasswordRecovery.forgotPassword);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Forgot password link is not clicked]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//h2[text()='Recover']"), Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Forgot Recover window is not visible after waiting 5 sec]";
				return false;
			}
			Browser.reloadPage(Global.driver);
			CommonFunctions.threadSleep(1);
			return true;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to Verify Login User Count
	public static Map<String, String> doVerifyUserLoginCount() {
		try {
			Map<String, String> maplogeduserStatus = new HashMap<String, String>();
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Login.TextBox.userNameTextBox, Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ ERROR :: User Name Text box is Not Visible ]";
				return null;
			}
			for (int i = 1; i <= 5; i++) {
				String name = Elements.getText(Global.driver, By.xpath("//tbody//tr[" + i + "]/td[3]"));
				if (name == null || name.isEmpty()) {
					Messages.errorMsg = "[ ERROR :: Not Able to get College Name]";
					return null;
				}
				String loggedUser = Elements.getText(Global.driver, By.xpath("//tbody//tr[" + i + "]/td[5]"));
				if (loggedUser == null || loggedUser.isEmpty()) {
					Messages.errorMsg = "[ ERROR :: Not Able to get logged User]";
					return null;
				}
				maplogeduserStatus.put(name, loggedUser);
			}
			return maplogeduserStatus;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// This method is used to verify course progress bar
	public static Map<String, String> VerifyCoursestatusProgressbar() {

		try {
			Map<String, String> mapCourseStatus = new HashMap<String, String>();
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
				return null;
			}

			int courseno = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='coursesBody']/div"));
			if (courseno == 0) {
				Messages.errorMsg = "[ERROR ::No Courses are available/check your locator]";
				return null;
			}
			for (int i = 1; i <= courseno; i++) {
				if (i > 3) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//h4 "));
					if (bStatus) {
						System.out.println("***Not Scrolled***********************");
					}
				}
				String courseTiltle = Elements.getText(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//h4"));
				if (courseTiltle == null || courseTiltle.isEmpty()) {
					Messages.errorMsg = "[ERROR ::Courses Title is not available]";
					return null;
				}
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div[" + i + "]//div[@role='progressbar']"));
				if (bStatus) {
					String coursepercentage = doGetElementAtt(By.xpath("//div[@id='coursesBody']/div[" + i + "]//div[@role='progressbar']"), "style").trim();
					if (coursepercentage == null) {
						Messages.errorMsg = "[ ERROR ::Not able to get Course Percentage ]";
						return null;
					}
					if (coursepercentage.equalsIgnoreCase("100%")) {
						mapCourseStatus.put(courseTiltle, coursepercentage);
					} else {
						mapCourseStatus.put(courseTiltle, coursepercentage);
					}
				} else {
					mapCourseStatus.put(courseTiltle, "0%");
				}
			}

			return mapCourseStatus;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static String doGetElementAtt(By locator, String attvalue) {
		try {
			String sattributevalue = Elements.getElementAttribute(Global.driver, locator, attvalue);
			String[] attributeper = sattributevalue.split("width:");
			String coursepercentage = attributeper[attributeper.length - 1];
			return coursepercentage;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// ************** [ This method is used to verify Lesson Titles and Description ]**************************
	public static boolean doVerifyLessonTitlesandDescription() {

		try {

			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
				return false;
			}

			int courseno = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))]//a"));
			if (courseno == 0) {
				Messages.errorMsg = "[ERROR ::No Courses are available/check your locator]";
				return false;
			}
			for (int i = 1; i <= courseno; i++) {
				if (i > 3) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a"));
					if (bStatus) {
						System.out.println("***Scrolled To web Element***********************");
					}
				}
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::Courses Title is not visible]";
					return false;
				}
				bStatus = Elements.click(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::Not able to Click  on Courses ]";
					return false;
				}
				bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='sectionBody']"), Constants.thirtySeconds);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
					return false;
				}

				int lessoncount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div//h4//a"));
				for (int j = 1; j <= lessoncount; j++) {

					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//h4//a"));
					// verify Course Title
					bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//h4//a"));
					if (bStatus) {
						String courseTiltle = Elements.getText(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//h4//a"));
						if (courseTiltle == null || courseTiltle.isEmpty()) {
							Messages.errorMsg = "[ERROR ::Courses Title is not available]";
							return false;
						}
						System.out.println("courseTiltle-" + courseTiltle);
					}

					// Verify course description
					bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//p"));
					if (bStatus) {
						String coursedescription = Elements.getText(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//p"));
						if (coursedescription == null || coursedescription.isEmpty()) {
							Messages.errorMsg = "[ERROR ::Courses description is not available]";
							return false;
						}
						System.out.println("description-" + coursedescription);
					}
				}
				CommonFunctions.threadSleep(Constants.twoSeconds);
				bStatus = Elements.click(Global.driver, Locators.CommonLocators.Label.homebutton);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::Home button is not Clicked]";
					return false;
				}
				CommonFunctions.threadSleep(Constants.twoSeconds);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This Method Is Used For Question Has Notes
	public static boolean doVerifyQuestionsHasNotes() {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CommonLocators.Label.coursestitle, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Title is not visible after waiting 30 sec]";
				return false;
			}

			int courseno = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))]//a"));
			if (courseno == 0) {
				Messages.errorMsg = "[ERROR ::No Courses are available/check your locator]";
				return false;
			}
			for (int i = 1; i <= courseno; i++) {
				if (i > 3) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a"));
					if (bStatus) {
						System.out.println("***Scrolled To web Element***********************");
					}
				}
				bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::Courses Title is not visible]";
					return false;
				}
				bStatus = Elements.click(Global.driver, By.xpath("//div[@id='coursesBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::Not able to Click  on Courses ]";
					return false;
				}
				bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='sectionBody']"), Constants.thirtySeconds);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
					return false;
				}
				CommonFunctions.threadSleep(1);
				String parentWindow = Global.driver.getWindowHandle();
				System.out.println(parentWindow);
				int notescount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div[not(contains(@class,'text-muted'))]//i[@class='fa fa-pencil']"));
				for (int j = 1; j <= notescount; j++) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody'] /div[not(contains(@class,'text-muted'))][" + j + "]//i[@class='fa fa-pencil']"));
					CommonFunctions.threadSleep(1);
					bStatus = Verify.verifyElementPresent(Global.driver, By.xpath("//div[@id='sectionBody'] /div[not(contains(@class,'text-muted'))][" + j + "]//i[@class='fa fa-pencil']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Please check your locator_Click for Notes]";
						return false;
					}

					bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='sectionBody'] /div[not(contains(@class,'text-muted'))][" + j + "]//i[@class='fa fa-pencil']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Click for Notes link is not clicked]";
						return false;
					}
					CommonFunctions.threadSleep(1);
					Set<String> allWindows = Global.driver.getWindowHandles();
					for (String curWindow : allWindows) {
						if (!curWindow.equals(parentWindow)) {
							Global.driver.switchTo().window(curWindow);
							CommonFunctions.threadSleep(1);
							Global.driver.close();
						}
					}
					Global.driver.switchTo().window(parentWindow);
					CommonFunctions.threadSleep(1);
				}
				Global.driver.navigate().back();
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to verify Terminal Questions
	public static boolean doValidateQuestionInvolvesCoding(Map<String, String> mapAllDetails) {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='coursesBody']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Page is not visible after waiting 10 sec]";
				return false;
			}
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']//div//h4//a[text()='" + mapAllDetails.get("Courses") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Course" + mapAllDetails.get("Courses") + " is not Scrolled]";
				return false;
			}
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='coursesBody']//div//h4//a[text()='" + mapAllDetails.get("Courses") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Course" + mapAllDetails.get("Courses") + " is not Clicked ]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='sectionBody']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
				return false;
			}

			// Lesson Enable count
			int lessonCount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div[not(contains(@class,'text-muted'))]//a[@class='topicNameATag']"));
			if (lessonCount == 0) {
				Messages.errorMsg = "[ERROR :: Lessons are not there in lessons page ]";
				return false;
			}
			for (int i = 1; i <= lessonCount; i++) {
				CommonFunctions.threadSleep(1);
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a[@class='topicNameATag']"));
				if (bStatus) {
					System.out.println("****************** Lessson Scrolled *********************");
				}

				bStatus = Verify.verifyElementPresent(Global.driver, By.xpath("//div[@id='sectionBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a[@class='topicNameATag']"));
				if (bStatus) {
					bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='sectionBody']/div[not(contains(@class,'text-muted'))][" + i + "]//a[@class='topicNameATag']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Lesson" + i + " is not clicked ]";
						return false;
					}

					bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//li[@id='topicNameHeading']"), Constants.thirtySeconds);
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
						return false;
					}
					bStatus = validateTerminalQuestions();
					if (!bStatus) {
						return false;
					}
					Global.driver.navigate().back();
				}
			}
			return true;
		}

		catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}

	public static boolean validateTerminalQuestions() {
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//li[@id='topicNameHeading']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
				return false;
			}

			int lessonfeatures = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div"));
			for (int j = 1; j <= lessonfeatures; j++) {

				bStatus = Verify.verifyElementPresent(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//div[@class='sectionsDiv']"));
				if (bStatus) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//div[@class='sectionsDiv']"));
					CommonFunctions.threadSleep(1);
					int questioncount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//div[@class='questionsArea']//span"));
					for (int k = 1; k <= questioncount; k++) {

						bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//div[@class='questionsArea']//span[" + k + "]//i[@class='fa fa-terminal']"));
						if (bStatus) {
							bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//div[@class='questionsArea']//span[" + k + "]//i[@class='fa fa-terminal']"));
							bStatus = Elements.click(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//div[@class='questionsArea']//span[" + k + "]//i[@class='fa fa-terminal']"));
							if (!bStatus) {
								Messages.errorMsg = "[ERROR :: Terminal question-" + k + " in lesson featurebody -" + j + " - is not clicked]";
								return false;
							}

							bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='modalBody']"), Constants.tenSeconds);
							if (!bStatus) {
								Messages.errorMsg = "[ERROR :: Terminal page is not visible after waiting 10 sec]";
								return false;
							}
							bStatus = Verify.verifyElementPresent(Global.driver, By.xpath("//div[@id='modalBody']//div[normalize-space()='Terminal']"));
							if (!bStatus) {
								Messages.errorMsg = "[ERROR :: Terminal locator is not present in Dom]";
								return false;
							}

							bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='modalBody']//div[normalize-space()='Terminal']"));
							bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='modalBody']//div[normalize-space()='Terminal']"));
							if (!bStatus) {
								Messages.errorMsg = "[ERROR :: Terminal is not visible]";
								return false;
							}
							bStatus = CommonFunctions.scrollToWebElement(Global.driver, By.xpath("//span[@class='btn btn-warning closeBtn']"));
							bStatus = Elements.click(Global.driver, By.xpath("//span[@class='btn btn-warning closeBtn']"));
							if (!bStatus) {
								Messages.errorMsg = "[ERROR :: Close option is not Clicked ]";
								return false;
							}

							bStatus = Verify.verifyAlertPresent(Global.driver);
							if (bStatus) {
								bStatus = Alerts.acceptAlert(Global.driver);
								if (!bStatus) {
									Browser.reloadPage(Global.driver);
								}
							} else {
								bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='modalBody']"));
								if (bStatus) {
									Browser.reloadPage(Global.driver);
								}
							}
							CommonFunctions.threadSleep(1);
						}
					}
				}
			}

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	// This method is used to verify Question Type
	public static boolean doVerifyQuestiontype(Map<String, String> mapquestion) {

		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='coursesBody']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Courses Page is not visible after waiting 10 sec]";
				return false;
			}
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']//div//h4//a[text()='" + mapquestion.get("Course Name") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Course" + mapquestion.get("Course Name") + " is not Scrolled]";
				return false;
			}
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='coursesBody']//div//h4//a[text()='" + mapquestion.get("Course Name") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Course" + mapquestion.get("Course Name") + " is not Clicked ]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='sectionBody']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Lesson details page is not visible after waiting 30 sec]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//a[@class='topicNameATag'][text()='" + mapquestion.get("Unit Name") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Unit Name" + mapquestion.get("Unit Name") + " is not Scrolled]";
				return false;
			}
			bStatus = CommonFunctions.jsClick(By.xpath("//a[@class='topicNameATag'][text()='" + mapquestion.get("Unit Name") + "']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Unit Name" + mapquestion.get("Unit Name") + " is not Clicked ]";
				return false;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//li[@id='topicNameHeading']"), Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Unit details page is not visible after waiting 30 sec]";
				return false;
			}
			CommonFunctions.threadSleep(1);
			String questiontypes = mapquestion.get("Question Type");
			String[] questiontype = questiontypes.split(",");
			for (int i = 0; i <= questiontype.length - 1; i++) {

				if (questiontype[i].trim().equalsIgnoreCase("Notes")) {
					bStatus = Verify.verifyElementVisible(Global.driver,
							By.xpath("//h4[normalize-space(text()) = '" + mapquestion.get("SubUnit") + "']/following-sibling::div//span[@qcount='" + mapquestion.get("Question No") + "']//i[@class='fa fa-info']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Notes symbol is not avilable in  question no -" + mapquestion.get("Question No") + "' - in unit " + mapquestion.get("SubUnit") + " ]";
						return false;
					}
				}
				if (questiontype[i].trim().equalsIgnoreCase("Demo")) {
					bStatus = Verify.verifyElementVisible(Global.driver,
							By.xpath("//h4[normalize-space(text()) = '" + mapquestion.get("SubUnit") + "']/following-sibling::div//span[@qcount='" + mapquestion.get("Question No") + "']//i[@class='fa fa-eye']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Demo symbol is not avilable in  question no -" + mapquestion.get("Question No") + "' - in unit " + mapquestion.get("SubUnit") + " ]";
						return false;
					}
				}

				if (questiontype[i].trim().equalsIgnoreCase("Coding")) {
					bStatus = Verify.verifyElementVisible(Global.driver,
							By.xpath("//h4[normalize-space(text()) = '" + mapquestion.get("SubUnit") + "']/following-sibling::div//span[@qcount='" + mapquestion.get("Question No") + "']//i[@class='fa fa-terminal']"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Coding symbol is not avilable in  question no -" + mapquestion.get("Question No") + "' - in unit " + mapquestion.get("SubUnit") + " ]";
						return false;
					}
				}
			}
			bStatus = CommonFunctions.spinnerClick(Global.driver, Locators.CommonLocators.Label.homebutton);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Home button is Not clicked]";
				return false;
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// This method is used to verify Lesson status bar

	public static Map<String, String> doVerifyLessonStatusbar(Map<String, String> mapCourseStatus) {
		try {
			Map<String, String> maplessonStatus = new HashMap<String, String>();
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Coursestatus.courses_heading, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Courses page is not visible]";
				return null;
			}

			if (mapCourseStatus.get("Course Name") != null && !mapCourseStatus.get("Course Name").isEmpty()) {
				// SCROLLING TO COURSE
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='coursesBody']//div/h4/a[text()='" + mapCourseStatus.get("Course Name") + "']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR:: Not scrolled till " + mapCourseStatus.get("Courses") + "Course.]";
					return null;
				}
				bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='coursesBody']//div/h4/a[text()='" + mapCourseStatus.get("Course Name") + "']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR:: Not clicked on  " + mapCourseStatus.get("Course Name") + "Course.]";
					return null;
				}
				bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Coursestatus.Lessonbody, Constants.tenSeconds);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR:: Lessons page is not visible.]";
					return null;
				}

				int lessoncount = Elements.getXpathCount(Global.driver, Locators.Coursestatus.lesson_e);
				if (lessoncount == 0) {
					Messages.errorMsg = "[ERROR: Title of the lessons is not displayed.]";
					return null;
				}

				for (int j = 1; j <= lessoncount; j++) {
					bStatus = Verify.verifyElementPresent(Global.driver, By.xpath("(//a[@class='topicNameATag'])[" + j + "]"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR: Lesson Name is not displayed.]";
						return null;
					}

					String lessonName = CommonFunctions.getTextUsingJS(Global.driver, By.xpath("(//a[@class='topicNameATag'])[" + j + "]"));
					// System.out.println(lessonName);

					bStatus = Verify.verifyElementPresent(Global.driver, By.xpath("(//a[@class='topicNameATag'])[" + j + "]"));
					if (!bStatus) {
						Messages.errorMsg = "[ERROR: Lesson Progress Bar is not displayed.]";
						return null;
					}

					int lesonbar = Elements.getXpathCount(Global.driver, Locators.Coursestatus.lessons_bar);
					if (lesonbar == 0) {
						Messages.errorMsg = "[ERROR: Title of the lessons-bar is not displayed.]";
						return null;
					}
					bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("(//i[contains(@class,'badge')])[" + j + "]"), Constants.tenSeconds);
					if (!bStatus) {
						Messages.errorMsg = "[ERROR:: Lessons page is not visible.]";
						return null;
					}

					String lessonBar = Elements.getText(Global.driver, By.xpath("(//i[contains(@class,'badge')])[" + j + "]"));

					System.out.println(lessonBar);

					System.out.println("Lesson: " + lessonName + " && " + "Lesson Progress bar is:" + lessonBar);
					maplessonStatus.put(lessonName, lessonBar);

				}
				Global.driver.navigate().back();
			}
			return maplessonStatus;
		}

		catch (Exception e) {
			e.printStackTrace();
			return null;

		}

	}

	//************* This method is used to verify Lesson Type *********//
	public static Map<String,String> doValidateLessonType(Map<String, String> mapcoursetype) {
		try {
			Map<String,String>maplessontype=new HashMap<String, String>();
			//Wait for Course Body
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Coursestatus.courses_heading, Constants.thirtySeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Course list not found]";
				return null;
			}

			//Checking for null and Empty fields 
			if(mapcoursetype.get("Course Name") !=null && !mapcoursetype.get("Course Name").isEmpty()) {

				//Scroll to course  
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//div[@id='coursesBody']/div/div/h4/a[text()='"+mapcoursetype.get("Course Name")+"']"));
				if(!bStatus) {
					Messages.errorMsg = "[ERROR ::" +mapcoursetype.get("Course Name")+" not scrolled]";
					return null;
				}
				//Verify Course is visible
				bStatus = Verify.verifyElementVisible(Global.driver,By.xpath("//div[@id='coursesBody']/div/div/h4/a[text()='"+mapcoursetype.get("Course Name")+"']"));
				if(!bStatus) {
					Messages.errorMsg = "[ERROR ::" +mapcoursetype.get("Course Name")+" not visible]";
					return null;
				}
				//Click on Course it will redirect to Lessons Page
				bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='coursesBody']/div/div/h4/a[text()='"+mapcoursetype.get("Course Name")+"']"));
				if(!bStatus) {
					Messages.errorMsg = "[ERROR ::" +mapcoursetype.get("Course Name")+" not clicked]";
					return null;
				}
				//Wait for Lessons Body
				bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//div[@id='sectionBody']/div") , Constants.fiveSeconds);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Lessons page not Visible]";
					return null;
				}
				//Getting text of Lessons body
				int lessoncount = Elements.getXpathCount(Global.driver, By.xpath("//div[@id='sectionBody']/div"));
				for (int i = 1; i <= lessoncount; i++) {
					bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + i + "]"));
					String lessontype = Elements.getText(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + i + "]//span"));

					if(lessontype.contains("Start from here")) {
						continue;
					}
					if(lessontype.equalsIgnoreCase("Will be enabled in sequence")){
						for(int j=i;j<=lessoncount;j++) {
							bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]"));
							String lessontypeseq = Elements.getText(Global.driver, By.xpath("//div[@id='sectionBody']/div[" + j + "]//span"));
							if(lessontypeseq.equalsIgnoreCase("Will be enabled in sequence")){
								maplessontype.put("Lesson Type", ""+mapcoursetype.get("Course Name")+" contains Sequential lessons");
							}
							else {
								maplessontype.put("Lesson Type1", ""+mapcoursetype.get("Course Name")+" contains Sequential lessons and some Lessons are enabled with Sequential order");
							}
						}
						if(maplessontype.get("Lesson Type1") !=null && !maplessontype.get("Lesson Type1").isEmpty() ) {
							maplessontype.replace("Lesson Type", maplessontype.get("Lesson Type1"));
							maplessontype.remove("Lesson Type1");
						}
						break;
					}
					else {
						maplessontype.put("Lesson Type Random", ""+mapcoursetype.get("Course Name")+" contains Random lessons");
					}			
				}
				Global.driver.navigate().back();

			}
			return maplessontype;
		}//End of the try
		catch(Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	//This Method is used to verify description and jump to another question in quick access slider panel
	public static boolean doVerifyQuestionDescriptionAndJumpToAnotherQuestionInQuickAccessSliderPanel() {
		try {
			//Click on Course 
			ApplicationFunctions.doSelectCourse("Milestone 2");

			//Wait For Unit Visible
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//a[text()='MCQ']"),Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: MCQ Unit is not Visible after Waiting 5sec]";
				return false;
			}
			//Click On Unit It Will Redirect To Sub Units Page
			bStatus = CommonFunctions.jsClick(By.xpath("//a[text()='MCQ']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: MCQ Unit is not clicked]";
				return false;
			}
			//Wait For Sub Unit Visible
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.verifyJumpStatus.subunitMCMA, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: MCMA-Sub Unit is not visible after waiting 30 sec]";
				return false;
			}
			//Click On Sub Unit It Will Redirect To Question Page 
			bStatus = CommonFunctions.jsClick(By.xpath("//h4[normalize-space(text())='MCMA']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: MCMA-Sub Unit is Not clicked]";
				return false;
			}
			//Click On Question It Will Redirect To Respective Question Window
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='MCMA' and @qcount='1']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::MCMA-Sub unit question 1 is  Not clicked]";
				return false;
			}
			//Wait For Quick Access Slider Panel Of Question 
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.verifyJumpStatus.sliderPanel, Constants.twentySecond);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Quick Access Slider Panel is  not visible after waiting 20 sec]";
				return false;
			}
			//Click On Quick Access Slider Panel 
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='quickQAccessTrapezoidSlider']"));
			if(!bStatus) { 
				Messages.errorMsg = "[ERROR ::Quick Access Slider Panel is  Not clicked]";
				return false;
			}

			//Single Click on first question it will redirect to description
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='quickQAccessSliderPanel']//span[@qcount='1']"));
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: First question is not clicked in slider bar ]";
				return false;
			}
			//Verify Questions description
			String ExpectedDescriptionText = "Correct answer is 1";

			bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//div[@class='popover-content questionText']"), Constants.twentySecond);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Description is not visible after waiting 20 sec]";
				return false;
			}

			String ActualDescriptionText = Global.driver.findElement(By.xpath("//div[@class='popover-content questionText']")).getText();
			if(!ExpectedDescriptionText.equals(ActualDescriptionText)) {
				Messages.errorMsg = "[ERROR :: "+ActualDescriptionText+" is not matched with expected Description -"+ExpectedDescriptionText+"]";
				return false;

			}

			//Wait for description close icon
			bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//span[text()='x']"), Constants.thirtySeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Description close icon not visible]";
				return false;
			}

			//Click on description close icon
			bStatus = CommonFunctions.jsClick(By.xpath("//span[text()='x']"));
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Description close icon not clicked]";
				return false;
			}

			//Wait for quick access slider bar close icon
			bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//div[@id='quickQAccessTrapezoidSliderHeader']/div[text()='Close x']"), Constants.fiveSeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Quick access slider bar questions close icon not visible]";
				return false;
			}

			//Click on quick access slider bar question close icon
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='quickQAccessTrapezoidSliderHeader']/div[text()='Close x']"));
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Quick access slider bar questions close icon not clicked]";
				return false;
			}

			//Click on question main window close icon
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@onclick='closeClicked()']"));
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Quuestions window close icon not clicked]";
				return false;
			}

			//Refresh
			Global.driver.navigate().refresh();

			//Wait For Sub Unit Visible
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.verifyJumpStatus.subunitMCMA, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: MCMA-Sub Unit is not visible after waiting 30 sec]";
				return false;
			}
			//Click On Question It Will Redirect To Respective Question Window
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='MCMA' and @qcount='1']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not clicked on Question]";
				return false;
			}
			//Wait For Quick Access Slider Panel Of Question 
			bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//div[@id='quickQAccessTrapezoidSlider']"), Constants.twentySecond);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Element is not visible after waiting 20 sec]";
				return false;
			}
			//Click On Quick Access Slider Panel 
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='quickQAccessTrapezoidSlider']"));
			if(!bStatus) { 
				Messages.errorMsg = "[ERROR :: Not clicked on Quick Access Slider Panel]";
				return false;
			}
			//Wait For Element
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.verifyJumpStatus.jumpedQuestion, Constants.twentySecond);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Element is not visible after waiting 20 sec]";
				return false;
			}
			bStatus = UserActions.doubleClick(Global.driver, Locators.verifyJumpStatus.jumpedQuestion);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Not clicked on Selected/Required Question in Quick Access Slider Panel]";
				return false;
			}


			//Wait for quick access slider bar close icon
			bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//div[@id='quickQAccessTrapezoidSliderHeader']/div[text()='Close x']"), Constants.fiveSeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Quick access slider bar questions close icon not visible]";
				return false;
			}
			//Close the Quick Access Slider Panel
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='quickQAccessTrapezoidSliderHeader']/div[text()='Close x']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not clicked on Close Icon]";
				return false;
			}


			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@id='quickQAccessTrapezoidSliderHeader']/span[@id='currentQuestionNumber']"), Constants.twentySecond);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Quick Access Trapezoid Silder Header is not visible after waiting 20 sec]";
				return false;
			}

			String quickacessheaderQNo = Elements.getText(Global.driver, By.xpath("//div[@id='quickQAccessTrapezoidSliderHeader']/span[@id='currentQuestionNumber']"));
			if(quickacessheaderQNo==null) {
				Messages.errorMsg = "[ERROR ::  Unable to get Quick Access Trapezoid Silder Header Question No, please check your locator]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//ol[@id='questionTitleOL']//li[@id='modalQNoHeading']"), Constants.twentySecond);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Question Title Question no is not visible after waiting 20 sec]";
				return false;
			}

			String questionTitleOL = Elements.getText(Global.driver, By.xpath("//ol[@id='questionTitleOL']//li[@id='modalQNoHeading']"));
			if(questionTitleOL==null) {
				Messages.errorMsg = "[ERROR ::  Unable to get Question Title Question no Question No, please check your locator]";
				return false;
			}

			String[] currentQuestionStatus =quickacessheaderQNo.split(":");
			String[] jumpedQuestionStatus = questionTitleOL.split(":");

			System.out.println(currentQuestionStatus[1]);
			System.out.println(jumpedQuestionStatus[1]);

			if(!currentQuestionStatus[1].trim().equals(jumpedQuestionStatus[1].trim())){ 
				Messages.errorMsg = "[ERROR :: Jumped Question Status or Not matched with Current Question Number]";
				return false;
			}
			//Click on Close Icon
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@onclick='closeClicked()']"));
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to Click on Close Icon]";
				return false;
			}

			return bStatus;
		}catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}

	public static boolean doSelectCourse(String course)
	{
		try 
		{
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Coursestatus.courses_heading, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Course list not found after Waiting 30sec]";
				return false;
			}
			//Scroll To Course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//a[text()='Milestone 2']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not scrolled to Element]";
				return false;
			}
			//Click On Course It Will redirect To Unit's Page
			bStatus = CommonFunctions.jsClick(By.xpath("//a[text()='Milestone 2']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::Not clicked on Course]";
				return false;
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public static boolean donavigatetosubunitquestion(String courseName, String unitName) {

		try {

			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Coursestatus.courses_heading, Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Course list not found after Waiting 30sec]";
				return false;
			}
			//Scroll To Course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver, By.xpath("//a[text()='"+courseName+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: "+courseName+" Course is not scrolled ]";
				return false;
			}
			//Click On Course It Will redirect To Unit's Page
			bStatus = CommonFunctions.jsClick(By.xpath("//a[text()='"+courseName+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR ::"+courseName+" -Course Not clicked]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//a[@class='topicNameATag'][text()='"+unitName+"']"), Constants.thirtySeconds);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: "+unitName+" is not visible after waiting 30 sec]";
				return false;
			}

			//Click on unit
			bStatus = CommonFunctions.jsClick(By.xpath("//a[@class='topicNameATag'][text()='"+unitName+"']"));
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: "+unitName+" unit is not clicked]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//li[@id='topicNameHeading']"), Constants.tenSeconds);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: Subunit  unit is page is not visibale after waiting 30 sec]";
				return false;
			}
			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}

	}

	public static boolean doValidateMultiplechoiceQuestion(Map<String,String>mapAnswserType) {

		try {

			//wait for the questions
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//h4[normalize-space(text())='"+mapAnswserType.get("SubUnit")+"']"), Constants.thirtySeconds);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: "+mapAnswserType.get("SubUnit")+" - sub unit is not visible after waiting 30 sec]";
				return false;
			}
			//click on question
			bStatus = CommonFunctions.jsClick(By.xpath("//h4[normalize-space(text())='"+mapAnswserType.get("SubUnit")+"']/..//span[@qcount='"+mapAnswserType.get("Question No")+"']"));
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR ::"+mapAnswserType.get("SubUnit")+" - question "+mapAnswserType.get("Question No")+"- is not clicked]";
				return false;
			}
			//wait for statistic button
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.question.question_reset, Constants.thirtySeconds);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: Reset button is not visible after waiting 30 sec]";
				return false;
			}

			bStatus = CommonFunctions.jsClick(Locators.question.question_reset);
			if (!bStatus)
			{
				Messages.errorMsg = "[ERROR :: Reset button has not been clicked ]";
				return false;
			}
			//to close the alert
			Global.driver.switchTo().alert().accept();

			if(mapAnswserType !=null && !mapAnswserType.isEmpty()) {


				if(mapAnswserType.get("Question Answer")!=null && !mapAnswserType.get("Question Answer").equalsIgnoreCase("All")) {

					bStatus = Verify.verifyElementVisible(Global.driver, By.xpath("//li[@class='mcOptionLi']["+mapAnswserType.get("Question Answer")+"]//input"));
					if (!bStatus)
					{
						Messages.errorMsg = "[ERROR :: ckeckbox_"+mapAnswserType.get("Question Answer")+" is not visible]";
						return false;
					}
					bStatus = CommonFunctions.jsClick( By.xpath("//li[@class='mcOptionLi']["+mapAnswserType.get("Question Answer")+"]//input"));
					if (!bStatus) 
					{
						Messages.errorMsg = "[ERROR :: ckeckbox_"+mapAnswserType.get("Question Answer")+" has not been selected ]";
						return false;
					}
				}
				if(mapAnswserType.get("Question Answer")!=null && mapAnswserType.get("Question Answer").equalsIgnoreCase("All")) {
					int totaloptions = Elements.getXpathCount(Global.driver, By.xpath("//li[@class='mcOptionLi']"));
					if(totaloptions==0) {
						Messages.errorMsg = "[ERROR :: Not able to get No of check boxes, please check your locators ]";
						return false;
					}

					for(int i=1;i<=totaloptions;i++) {
						bStatus = Verify.verifyElementPresent(Global.driver,By.xpath("//li[@class='mcOptionLi']["+i+"]//input"));
						if (!bStatus)
						{
							Messages.errorMsg = "[ERROR :: ckeckbox_"+i+" is not visible]";
							return false;
						}
						bStatus = CommonFunctions.jsClick( By.xpath("//li[@class='mcOptionLi']["+i+"]//input"));
						if (!bStatus) 
						{
							Messages.errorMsg = "[ERROR :: ckeckbox_"+i+" has not been selected ]";
							return false;
						}
					}

				}
				// Submit the question
				bStatus = Wait.waitForElementVisibility(Global.driver,Locators.question.question_submit, Constants.twoSeconds);
				if (!bStatus)
				{
					Messages.errorMsg = "[ERROR ::Submit button is not visible after waiting 2 sec]";
					return false;
				}
				bStatus = CommonFunctions.jsClick(Locators.question.question_submit);
				if (!bStatus) 
				{
					Messages.errorMsg = "[ERROR :: Submit button has not been clicked ]";
					return false;
				}

				bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//article[text()='"+mapAnswserType.get("Error Messages")+"']"), Constants.twentySecond);
				if (!bStatus)
				{
					bStatus = CommonFunctions.jsClick(Locators.question.question_close);
					if (!bStatus) {
						Messages.errorMsg = "[ERROR :: Submit button has not been clicked ]";
						return false;
					}
					Global.driver.navigate().refresh();
					Messages.errorMsg = "[ERROR ::"+mapAnswserType.get("Question Answer")+" -  Error messages --"+mapAnswserType.get("Error Messages")+"-- is not display after waiting 20 sec ]";
					return false;
				}
				bStatus = CommonFunctions.jsClick(Locators.question.question_close);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Submit button has not been clicked ]";
					return false;
				}
				Global.driver.navigate().refresh();
			}
			return true;
		}
		catch (Exception e) {

			e.printStackTrace();
			return false;
		}
	}

	public static boolean doValidateCopyWriteCourses(Map<String,String>mapcoppywrite) {
		try {

			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapcoppywrite.get("SubUnit")+"' and @qcount='"+mapcoppywrite.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapcoppywrite.get("SubUnit")+"]";
				return false;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapcoppywrite.get("SubUnit")+"' and @qcount='"+mapcoppywrite.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapcoppywrite.get("SubUnit")+"]";
				return false;
			}

			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//span[@onclick='closeClicked()']"), Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Question Description page is not visible after waiting 60 sec ]";
				return false;
			}
			Thread.sleep(2000);
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[text()='Reset']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  Reset button]";
				return false;
			}

			bStatus = CommonFunctions.jsClick(By.xpath("//span[text()='Reset']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Reset button is not clicked]";
				return false;
			}

			Global.driver.switchTo().alert().accept();

			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//input[@class='correctContentFileName']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  Correct Content FileName]";
				return false;
			}

			/*bStatus = CommonFunctions.jsClick(By.xpath("//div[contains(@class,'copyWritingRight')]/textarea"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Copy write Text area is not clicked]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[contains(@class,'copyWritingRight ace_focus')]/textarea"), Constants.fiveSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Copy write Text area focus  is not visible after waiting 5 sec]";
				return false;
			}
			 */


			if(mapcoppywrite !=null) {
				Thread.sleep(3000);

				WebElement javacwrt= Global.driver.findElement(By.xpath("(//textarea[@class='ace_text-input'])[2]"));
				JavascriptExecutor javacwrtExecutor = (JavascriptExecutor) Global.driver;
				javacwrtExecutor.executeScript("arguments[0].click();", javacwrt);

				if(mapcoppywrite.get("Question Type").equalsIgnoreCase("Java Copy Writing")) {
					javacwrt.sendKeys("package q10755;\n" + 
							"public class PrintHello { \n" + 
							"public static void main(String[] args) { \n" + 
							"System.out.println(\"Hello, I am learning Java!\"); \n" + 
							"} \n" + 
							"}");
				}
				if(mapcoppywrite.get("Question Type").equalsIgnoreCase("C Copy Writing")) {
					javacwrt.sendKeys("#include <stdio.h>\n" + 
							"int main() { \n" + 
							"printf(\"Dare to dream!\\n\");\n" + 
							"return 0;\n" + 
							"}");
				}
				if(mapcoppywrite.get("Question Type").equalsIgnoreCase("C++ Copy Writing")) {
					javacwrt.sendKeys("#include <iostream>\n" + 
							"using namespace std;\n" + 
							"int main() {\n" + 
							"int i; \n" + 
							"for (i = 0; i < 5; i++) {\n" + 
							"cout << \"i = \" << i << \"\\n\";");
				}
				if(mapcoppywrite.get("Question Type").equalsIgnoreCase("Python Copy Writing")) {
					javacwrt.sendKeys("a = 365\n" + 
							"print(type(a)) \n" + 
							"a = 345.65  \n" + 
							"print(type(a)) \n" + 
							"a = 45 + 5j  \n" + 
							"print(type(a))");
				}
			}



			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[text()='Submit']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  Submit button]";
				return false;
			}

			bStatus = CommonFunctions.jsClick(By.xpath("//span[text()='Submit']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Submit button is not clicked]";
				return false;
			}

			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//span[text()=' - All test cases have succeeded!']"), Constants.twentySecond);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: All test cases have not succeeded!]";
				return false;
			}
			bStatus=Verify.verifyElementsPresent(Global.driver, By.xpath("//article[text()='Successfully submitted the question.']"));
			if(!bStatus) {
				Messages.errorMsg="[ERROR ::error message is not verified]";
				return false;
			}
			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
			// TODO: handle exception
		}

	}
	//navigate to course terminal
	public static boolean coursenavigatetoterminal()
	{
		try {
			bStatus = Wait.waitForElementVisibility(Global.driver, Locators.Validateterminal.coursesbody,Constants.thirtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Course list not found]";
				return false;
			}
			// Scroll to course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//div[@id='coursesBody']/div/div/h4/a[text()='Milestone 2']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: :scroll to the course is not visible]";
				return false;
			}

			// Click on Lessons Page
			bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='coursesBody']/div/div/h4/a[text()='Milestone 2']"));
			if (!bStatus) {
				Messages.errorMsg = "Click not performed on Lesson";
				return false;
			}

			// Click on Unit Coding
			bStatus = CommonFunctions.jsClick(By.xpath("//a[text()='Coding']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on Unit coding]";
				return false;
			}

			// Click on Cerrjava Question
			bStatus = CommonFunctions.jsClick(By.xpath("(//span[@subunitname='CErr Java' and @qcount='1'])[1]"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on errjava Question]";
				return false;
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}

	}	

	public static boolean dointeractwithTerminalverifytext(String terminalcmdname,String entertext) {
		try {

			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//span[@onclick='closeClicked()']"), Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Question Description page is not visible after waiting 60 sec ]";
				return false;
			}
			Thread.sleep(2000);
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[text()='Reset']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  Reset button]";
				return false;
			}

			JavascriptExecutor jsExecutor = (JavascriptExecutor) Global.driver;
			int i;

			for (i = 0; i < 25; i++) {
				Thread.sleep(50);
				String text = entertext;
				try {
					// waiting for terminal to be ready
					String status = (String) jsExecutor.executeScript("if (window.consoleTermSoc === null || window.consoleTerm === null) return 'failed'; else return 'success';");
					if ("success".equals(status)) {
						break;
					}
				} catch (Throwable t) {
					t.printStackTrace();
				}
			}

			if (i == 25) {
				System.out.println("Timed out!");
			} else {
				for (i = 0; i < 25; i++) {
					String text = getConsoleContents(jsExecutor);
					if (text != null) {
						text = text.trim();
						if (text.endsWith(terminalcmdname)) {
							jsExecutor.executeScript("return window.consoleTermSoc.emit('data', 'echo CodeTantra\\n') && false;");
							Thread.sleep(50);
							text = getConsoleContents(jsExecutor);
							if (text != null) {
								text = text.trim();
								text= text.replaceAll("\\s","");
								System.out.println(text);
								if (text.endsWith("CodeTantra" +"code@tantra:~/"+terminalcmdname+"")) {
									System.out.println("Text verified Sucessfully");
									return true;
								} 
								else {
									return false;
								}
							} else {
								return false;
							}
						}
					}
					Thread.sleep(50);
				}
				if (i == 25) {
					System.out.println("Timed out!");
					return false;
				}
			}
			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
			// TODO: handle exception
		}
	}
	//This method is used to interact with Terminal
	private static String getConsoleContents(JavascriptExecutor jsExecutor) {
		System.out.println("fetching text from term");
		jsExecutor.executeScript("window.consoleTerm.selectAll();");
		return (String) jsExecutor.executeScript("return window.consoleTerm.getSelection();");
	}

	public static boolean doinputDatainEditor(Map<String,String>mapeditor){

		try {

			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapeditor.get("SubUnit")+"' and @qcount='"+mapeditor.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapeditor.get("SubUnit")+"]";
				return false;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapeditor.get("SubUnit")+"' and @qcount='"+mapeditor.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapeditor.get("SubUnit")+"]";
				return false;
			}

			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//span[@onclick='closeClicked()']"), Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Question Description page is not visible after waiting 60 sec ]";
				return false;
			}
			Thread.sleep(2000);
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[text()='Reset']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  Reset button]";
				return false;
			}

			bStatus = CommonFunctions.jsClick(By.xpath("//span[text()='Reset']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Reset button is not clicked]";
				return false;
			}

			Global.driver.switchTo().alert().accept();

			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//label[text()='Correct/Complete the Code :']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view label Correct]";
				return false;
			}

			if(mapeditor.get("Question Type").equalsIgnoreCase("Compilations Error")) {
				WebElement ab = Global.driver.findElement(By.xpath("//textarea[@class='ace_text-input']"));
				JavascriptExecutor abb = (JavascriptExecutor) Global.driver;
				abb.executeScript("arguments[0].click();", ab);
				Thread.sleep(3000);
				ab.sendKeys("@kavitha)");
			}

			if(mapeditor.get("Question Type").equalsIgnoreCase("Vaild Test Cases")) {
				WebElement b = Global.driver.findElement(By.xpath("//textarea[@class='ace_text-input']"));
				JavascriptExecutor bb = (JavascriptExecutor) Global.driver;
				bb.executeScript("arguments[0].click();", b);
				Thread.sleep(3000);
				b.sendKeys("@public static void main(String[] args){");
				b.sendKeys(Keys.ENTER);
				b.sendKeys("//");
				b.sendKeys(Keys.DOWN);
				//b.sendKeys(Keys.DOWN);
				b.sendKeys("stem.out.println(\"Hello, I am learning Java!\");");
				b.sendKeys(Keys.ENTER);
				b.sendKeys("//");

				bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[text()='Submit']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Not able to scroll to view  Submit button]";
					return false;
				}

				bStatus = CommonFunctions.jsClick(By.xpath("//span[text()='Submit']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Submit button is not clicked]";
					return false;
				}
			}

			if(mapeditor.get("Question Type").equalsIgnoreCase("Invalid Test Case")) {
				WebElement b = Global.driver.findElement(By.xpath("//textarea[@class='ace_text-input']"));
				JavascriptExecutor bb = (JavascriptExecutor) Global.driver;
				bb.executeScript("arguments[0].click();", b);
				Thread.sleep(3000);
				b.sendKeys("@public static void main(String[] args){");
				b.sendKeys(Keys.ENTER);
				b.sendKeys("//");
				b.sendKeys(Keys.DOWN);
				//b.sendKeys(Keys.DOWN);
				b.sendKeys("stem.out.println(\"Hello I am learning c++!\");");
				b.sendKeys(Keys.ENTER);
				b.sendKeys("//");
			}

			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[text()='Submit']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  Submit button]";
				return false;
			}

			bStatus = CommonFunctions.jsClick(By.xpath("//span[text()='Submit']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Submit button is not clicked]";
				return false;
			}
			//Wait for spinner invisibility
			bStatus = CommonFunctions.waitForElementInvisibility(Locators.CompilationErrors.spinner, Constants.iSpinnerTime);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: spinner visibile  after waiting 120 sec]";
				return false;	
			}

			if(mapeditor.get("Question Type").equalsIgnoreCase("Compilations Error")) {
				bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//h4[text()='Compilation Errors']"), Constants.twoSeconds);
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Compilation Errors are not visible after waiting 20 sec]";
					return false;
				}
			}

			if(mapeditor.get("Question Type").equalsIgnoreCase("Vaild Test Cases")) {
				bStatus=Verify.verifyElementsPresent(Global.driver, By.xpath("//article[text()='Successfully submitted the question.']"));
				if(!bStatus) {
					Messages.errorMsg="[ERROR ::error message is not verified]";
					return false;
				}
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@onclick='closeClicked()']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Not able to scroll to view Close button]";
					return false;
				}

				bStatus= Verify.verifyElementVisible(Global.driver, By.xpath("//span[text()=' - All test cases have succeeded!']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::All test cases  are not succeeded]";
					return false;
				}
			}
			if(mapeditor.get("Question Type").equalsIgnoreCase("Invalid Test Case")) {
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@onclick='closeClicked()']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Not able to scroll to view Close button]";
					return false;
				}

				bStatus= Verify.verifyElementsPresent(Global.driver, By.xpath("//span[text()=' - Some test cases have failed.']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR ::All test cases  are not succeeded]";
					return false;
				}
			}

			bStatus= CommonFunctions.jsClick (By.xpath("//span[@onclick='closeClicked()']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Close button is not clicked  ]";
				return false;
			}
			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//i[@class='fa fa-home']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Button is Not visible after waiting 10 sec  ]";
				return false;
			}
			bStatus= CommonFunctions.jsClick (By.xpath("//i[@class='fa fa-home']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Page button is not clicked  ]";
				return false;
			}
			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public static boolean doValiadateFacultyLockedQuestion(Map<String,String>mapfacultylock) {

		try {

			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapfacultylock.get("SubUnit")+"' and @qcount='"+mapfacultylock.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapfacultylock.get("SubUnit")+"]";
				return false;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapfacultylock.get("SubUnit")+"' and @qcount='"+mapfacultylock.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapfacultylock.get("SubUnit")+"]";
				return false;
			}

			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//span[@onclick='closeClicked()']"), Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Question Description page is not visible after waiting 60 sec ]";
				return false;
			}

			//Wait for question quick access slider
			bStatus = Wait.waitForElementVisibility(Global.driver,Locators.FacultyLockSystem.cerrjavaquestionquickaccessslider, Constants.fiveSeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: question quick access slider not Visible]";
				return false;
			}
			//Click on question quick access slider
			bStatus = Elements.click(Global.driver,Locators.FacultyLockSystem.cerrjavaquestionquickaccessslider);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Click not performed Visiblequestion quick access slider]";
				return false;
			}

			if(mapfacultylock.get("Functionality").equalsIgnoreCase("Lock Question")) {
				bStatus = doVerifyFacultyLockSystem(mapfacultylock);
				if(!bStatus) {
					return false;
				}
			}
			if(mapfacultylock.get("Functionality").equalsIgnoreCase("UnLock Question")) {
				bStatus = doVerifyFacultyUnLockSystem();
				if(!bStatus) {
					return false;
				}
			}

			bStatus= Verify.verifyElementVisible(Global.driver, By.xpath("//div[@id='trapezoidSliderClose']"));
			if(bStatus) {
				bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='trapezoidSliderClose']"));
				bStatus = CommonFunctions.jsClick(By.xpath("//span[@onclick='closeClicked()']"));
				if(!bStatus) {
					Messages.errorMsg = "[ERROR ::Trapezoid Slider Close is not clicked]";
					return false;	
				}
			}



			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;// TODO: handle exception
		}
	}


	//******************************Faculty Lock System with out selecting Group********************************//
	public static boolean doVerifyFacultyLockSystem(Map<String,String>mapgroup) {
		try {

			//Wait for Unlock Image Icon
			bStatus = Wait.waitForElementVisibility(Global.driver,Locators.FacultyLockSystem.facultyunlockimageicon,Constants.tenSeconds);	
			if(!bStatus) {
				bStatus= Verify.verifyElementVisible(Global.driver, By.xpath("//img[@id='lock']"));
				if(!bStatus) {
					Messages.errorMsg = "[ERROR ::Unlock image icon is not clicked]";
					return false;
				}
			}

			bStatus =Wait.waitForElementVisibility(Global.driver, By.xpath("//a[@class='select2-search-choice-close']"),Constants.twoSeconds);
			if(bStatus) {
				bStatus = Elements.click(Global.driver, By.xpath("//a[@class='select2-search-choice-close']"));
				if(!bStatus) {
					CommonFunctions.threadSleep(Constants.twoSeconds);
					bStatus = Elements.click(Global.driver, By.xpath("//a[@class='select2-search-choice-close']"));
					if(!bStatus) {
						Messages.errorMsg = "[ERROR ::Select Group is not cleared]";
						return false;
					}
				}
				CommonFunctions.threadSleep(Constants.twoSeconds);
			}
			//Click on Unlock image icon
			bStatus = Elements.click(Global.driver,Locators.FacultyLockSystem.facultyunlockimageicon);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Unlock image icon is Not clicked]";
				return false;
			}
			//Verify unsuccessful message for locking a question
			bStatus = Wait.waitForElementVisibility(Global.driver,Locators.FacultyLockSystem.facultylockunsuccessmessage,Constants.tenSeconds);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::unsuccessful message is not displayed even lock is not performed]";
				return false;
			}	
			//bStatus = CommonFunctions.waitForElementInvisibility(Global.driver,Locators.FacultyLockSystem.grouptextbox, Constants.tenSeconds);

			//Enter text in group text box
			bStatus = Elements.enterText(Global.driver,Locators.FacultyLockSystem.grouptextbox,mapgroup.get("Faculty Group Name"));	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: SubUnits page not Visible]";
				return false;
			}
			//Press enter after typing group
			bStatus = CommonFunctions.doPressEnter(Locators.FacultyLockSystem.grouptextbox);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Click not performed on Unlock image icon]";
				return false;
			}
			//Click on Unlock image icon
			bStatus = Elements.click(Global.driver,Locators.FacultyLockSystem.facultyunlockimageicon);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Click not performed on Unlock image icon]";
				return false;
			}
			//Verify Successful message for locking a question
			bStatus = Wait.waitForElementVisibility(Global.driver,Locators.FacultyLockSystem.facultylocksuccessmessage,Constants.tenSeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Successful message is not displayed even lock is performed]";
				return false;
			}	


		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	//******************************Verify Lock System as a member of Group********************************//
	public static boolean doVerifyLockSystemAsMemberOfGroup() {
		try {

			//Wait for Lock Symbol available for member
			bStatus = Wait.waitForElementVisibility(Global.driver,Locators.FacultyLockSystem.memberlockimage, Constants.twoSeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Member lock image is not displayed after waiting 20 sec]";
				return false;
			}	
			//Verify Lock Symbol visible for member
			bStatus = Verify.verifyElementVisible(Global.driver,Locators.FacultyLockSystem.memberlockimage);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Member lock image is not displayed for assigned group member]";
				return false;
			}
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	//******************************Verify Lock System as not a member of Group********************************//
	public static boolean doVerifyLockSystemAsNotMemberOfGroup() {
		try {
			//Wait for Lock Symbol available for member
			bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//span[text()='Courses']"), Constants.fiveSeconds);
			if(bStatus) {
				bStatus = Verify.verifyElementVisible(Global.driver,Locators.FacultyLockSystem.memberlockimage);	
				if(bStatus) {
					Messages.errorMsg = "[ERROR ::Member lock image is displayed for Not assigned group member]";
					return false;
				}
				return true;
			}	
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	//******************************  Faculty Unlock System********************************//
	public static boolean doVerifyFacultyUnLockSystem() {
		try {

			//Wait for locked image icon
			bStatus = Wait.waitForElementVisibility(Global.driver,Locators.FacultyLockSystem.facultylockedimageicon ,Constants.fiveSeconds);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: faculty unlock image icon is not visible]";
				return false;
			}
			//Click on locked image icon
			bStatus = Elements.click(Global.driver,Locators.FacultyLockSystem.facultylockedimageicon);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Click not performed on Unlock image icon]";
				return false;
			}
			//Verify Successful message for unlocking a question
			bStatus = Verify.verifyElementVisible(Global.driver,Locators.FacultyLockSystem.unlocksuccessmessage);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::unsuccessful message is not displayed even lock is not performed]";
			}	

		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	//************ Validate Multi Language by changing languages with wrong code **************************//
	public static boolean doValidateMultilangugesbyWrongcode(Map<String,String>mapmultilang) {

		try {
			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapmultilang.get("SubUnit")+"' and @qcount='"+mapmultilang.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapmultilang.get("SubUnit")+"]";
				return false;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapmultilang.get("SubUnit")+"' and @qcount='"+mapmultilang.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapmultilang.get("SubUnit")+"]";
				return false;
			}
			//wait for evalation form
			bStatus= Wait.waitForElementVisibility(Global.driver, By.id("evalForm"), Constants.thirtySeconds);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Question evalation form visible after waiting 30 sec]";
				return false;
			}
			//Creating list for programming languages
			ArrayList<String> multilanglist=new ArrayList<String>();
			multilanglist.add("C");
			multilanglist.add("C++");
			multilanglist.add("Java");
			multilanglist.add("Python");
			System.out.println(multilanglist);

			for (int i=multilanglist.size()-1;i>=0;i--)  {


				if(i!=multilanglist.size()-1) {

					bStatus = CommonFunctions.scrollToWebElement(Global.driver,Locators.CompilationErrors.resetbutton);
					if(!bStatus) { 
						Messages.errorMsg = "[ERROR :: Not scroled to reset button]";
						return false; 
					} 
					bStatus =Elements.click(Global.driver,Locators.CompilationErrors.resetbutton); 
					if(!bStatus) { 
						Messages.errorMsg = "[ERROR :: Reset not performed]";
						return false; 
					} 
					//Accept the alertbox
					bStatus = Verify.verifyAlertPresent(Global.driver);
					if(bStatus) {
						Global.driver.switchTo().alert().accept();
					}
					Thread.sleep(3000);
				}
				bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.CompilationErrors.completetheCodelabel);
				if(!bStatus) { 
					Messages.errorMsg = "[ERROR ::  not scrolled to Editor]";
					return false; 
				}
				bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//div[@class='ace_gutter']"), Constants.tenSeconds);
				WebElement e2 = Global.driver.findElement(By.xpath("//textarea[@class='ace_text-input'][1]"));
				JavascriptExecutor js1 = (JavascriptExecutor) Global.driver;
				js1.executeScript("arguments[0].click();", e2);
				Thread.sleep(3000);

				e2.sendKeys(Keys.UP);
				e2.sendKeys(Keys.UP); 
				e2.sendKeys(Keys.END);
				e2.sendKeys(Keys.ENTER);
				System.out.println(multilanglist.get(i));
				e2.sendKeys("Hi i am "+multilanglist.get(i)+" language");
				bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.CompilationErrors.seleclangtdropdown);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Not scrolled to Dropdown]";
					return false;	
				}

				Select languagedropdown2 = new Select(Global.driver.findElement(By.xpath("//select[@class='form-control input-sm']")));
				languagedropdown2.selectByVisibleText(multilanglist.get(i));
				bStatus = Wait.waitForElementPresence(Global.driver,Locators.CompilationErrors.alertboxafterlanguagechange , Constants.fiveSeconds);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Alertbox not present after waiting five seconds]";
					return false;
				}
				bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.CompilationErrors.alertboxafterlanguagechange);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Not scrolled to Alertbox]";
					return false;	
				}
				bStatus = Verify.verifyElementVisible(Global.driver, Locators.CompilationErrors.alertboxafterlanguagechange);
				if(bStatus) {
					//Click on No if alert available
					bStatus = Elements.click(Global.driver,Locators.CompilationErrors.alertno);
					if(!bStatus) {
						Messages.errorMsg = "[ERROR :: Alertbox dismiss not performed ]";
						return false;	
					}
				}else {
					continue;
				}

				//Scroll to submit button
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver,Locators.CompilationErrors.submitbutton);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Not scrolled to submit ]";
					return false;
				}
				//Click on submit button
				bStatus = Elements.clickButton(Global.driver,Locators.CompilationErrors.submitbutton);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: submit button not clicked]";
					return false;
				}
				//Wait for invisibility of spinner
				bStatus = CommonFunctions.waitForElementInvisibility(By.xpath("//div[@id='compilationProgressDiv2'][@style='display: block;']"), Constants.iSpinnerTime);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: spinner visibile  after waiting 120 sec]";
					return false;	
				}
				//Scroll to submit button
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver,Locators.CompilationErrors.compilationerrorlist);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Not scrolled to compilationErrorslist ]";
					return false;
				}
				bStatus = Verify.verifyElementVisible(Global.driver, Locators.CompilationErrors.compilationerrorlist);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: compilationerrorlist not visible]";
					return false;
				}

				bStatus = Wait.waitForElementVisibility(Global.driver, Locators.CompilationErrors.seleclangtdropdown, Constants.fiveSeconds);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Language dropdown not visible]";
					return false;
				}
			}
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@onclick='closeClicked()']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view Close button]";
				return false;
			}

			bStatus= CommonFunctions.jsClick (By.xpath("//span[@onclick='closeClicked()']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Close button is not clicked  ]";
				return false;
			}
			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//i[@class='fa fa-home']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Button is Not visible after waiting 10 sec  ]";
				return false;
			}
			bStatus= CommonFunctions.jsClick (By.xpath("//i[@class='fa fa-home']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Page button is not clicked  ]";
				return false;
			}
			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
			// TODO: handle exception
		}
	}

	//************ Validate Multi Language by changing languages with out code **************************//
	public static boolean doValidateMultilangugesbyemptycode(Map<String,String>mapmultilang) {

		try {
			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapmultilang.get("SubUnit")+"' and @qcount='"+mapmultilang.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapmultilang.get("SubUnit")+"]";
				return false;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapmultilang.get("SubUnit")+"' and @qcount='"+mapmultilang.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapmultilang.get("SubUnit")+"]";
				return false;
			}
			//wait for evalation form
			bStatus= Wait.waitForElementVisibility(Global.driver, By.id("evalForm"), Constants.thirtySeconds);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Question evalation form visible after waiting 30 sec]";
				return false;
			}
			ArrayList<String> multilanglist=new ArrayList<String>();
			multilanglist.add("C");
			multilanglist.add("C++");
			multilanglist.add("Java");
			multilanglist.add("Python");
			System.out.println(multilanglist);

			for (int i=multilanglist.size()-1;i>=0;i--)  {

				bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.CompilationErrors.completetheCodelabel);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Not scrolled to Dropdown]";
					return false;	
				}
				Select languagedropdown2 = new Select(Global.driver.findElement(By.xpath("//select[@class='form-control input-sm']")));
				languagedropdown2.selectByVisibleText(multilanglist.get(i));
				CommonFunctions.threadSleep(2);

				bStatus = Verify.verifyElementVisible(Global.driver, Locators.CompilationErrors.alertboxafterlanguagechange);
				if(!bStatus) 
					continue;
				else if(bStatus) {
					Messages.errorMsg = "[ERROR :: Even Code is not changed, Alert is Present]";
					return false;
				}
			}
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@onclick='closeClicked()']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view Close button]";
				return false;
			}

			bStatus= CommonFunctions.jsClick (By.xpath("//span[@onclick='closeClicked()']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Close button is not clicked  ]";
				return false;
			}
			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//i[@class='fa fa-home']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Button is Not visible after waiting 10 sec  ]";
				return false;
			}
			bStatus= CommonFunctions.jsClick (By.xpath("//i[@class='fa fa-home']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Page button is not clicked  ]";
				return false;
			}
			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
			// TODO: handle exception
		}
	}

	//************ Validate Multi Language by changing languages with Correct code **************************//
	public static boolean doValidateMultilangugesbycorrectcode(Map<String,String>mapmultilang) {

		try {
			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapmultilang.get("SubUnit")+"' and @qcount='"+mapmultilang.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapmultilang.get("SubUnit")+"]";
				return false;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapmultilang.get("SubUnit")+"' and @qcount='"+mapmultilang.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapmultilang.get("SubUnit")+"]";
				return false;
			}
			//wait for evalation form
			bStatus= Wait.waitForElementVisibility(Global.driver, By.id("evalForm"), Constants.thirtySeconds);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Question evalation form visible after waiting 30 sec]";
				return false;
			}
			//SCroll to Reset Button
			bStatus = CommonFunctions.scrollToWebElement(Global.driver,Locators.CompilationErrors.resetbutton);
			if(!bStatus) { 
				Messages.errorMsg = "[ERROR :: Not scroled to reset button]";
				return false; 
			} 
			//Click on Reset Button
			bStatus =Elements.click(Global.driver,Locators.CompilationErrors.resetbutton); 
			if(!bStatus) { 
				Messages.errorMsg = "[ERROR :: Reset not performed]";
				return false; 
			} 

			//Accept the alertbox
			bStatus = Verify.verifyAlertPresent(Global.driver);
			if(bStatus) {
				Global.driver.switchTo().alert().accept();
			}

			//Scroll to editor
			bStatus = CommonFunctions.scrollToWebElement(Global.driver, Locators.CompilationErrors.scrollEditor);
			if(!bStatus) { 
				Messages.errorMsg = "[ERROR ::  Not scrolled to Editor]";
				return false; 
			}
			//wait for scroll dropdown
			bStatus= Wait.waitForElementVisibility(Global.driver, Locators.CompilationErrors.seleclangtdropdown, Constants.thirtySeconds);
			if(!bStatus) { 
				Messages.errorMsg = "[ERROR :: Select to write language drop down is not visible after waitiing 30 sec]";
				return false; 
			} 
			bStatus =Wait.waitForElementVisibility(Global.driver, Locators.CompilationErrors.filenameofmultilanguage, Constants.twoSeconds);
			// Get text of filename
			String attavale= Elements.getElementAttribute(Global.driver,Locators.CompilationErrors.filenameofmultilanguage , "filename");		
			System.out.println(attavale);

			// Verifying file name is null
			if(attavale==null) {
				Messages.errorMsg = "[ERROR :: Not able to get language type form file name]";
				return false; 
			}
			//Verifying file name not contains java
			if( !attavale.contains(".java")) {

				//If file name is not java, select language as java
				Select languagedropdown2 = new Select(Global.driver.findElement(By.xpath("//select[@class='form-control input-sm']")));
				languagedropdown2.selectByVisibleText("Java");
				//Verify for visibility of alert
				bStatus = Verify.verifyElementVisible(Global.driver, Locators.CompilationErrors.alertboxafterlanguagechange);
				if(bStatus) {
					//if alertbox is visibile click on yes
					bStatus = Elements.click(Global.driver,Locators.CompilationErrors.alertyes);
					if(!bStatus) {
						Messages.errorMsg = "[ERROR :: Alertbox dismiss not performed ]";
						return false;	
					}
				}	
			}

			//Enter correct code in Editor
			WebElement editorclick = Global.driver.findElement(By.xpath("//textarea[@class='ace_text-input'][1]"));
			JavascriptExecutor jsEditor = (JavascriptExecutor) Global.driver;
			jsEditor.executeScript("arguments[0].click();", editorclick);
			CommonFunctions.threadSleep(2);
			editorclick.sendKeys(Keys.UP);
			editorclick.sendKeys(Keys.UP); 
			editorclick.sendKeys(Keys.END);
			editorclick.sendKeys(Keys.ENTER);
			editorclick.sendKeys("int c=a+b;");
			editorclick.sendKeys(Keys.ENTER);
			editorclick.sendKeys("return c;");

			//Scroll to submit button
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,Locators.CompilationErrors.submitbutton);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Not scrolled to submit ]";
				return false;
			}
			//Click on submit button
			bStatus = Elements.clickButton(Global.driver,Locators.CompilationErrors.submitbutton);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: submit button not clicked]";
				return false;
			}
			//Wait for spinner invisibility
			bStatus = CommonFunctions.waitForElementInvisibility(Locators.CompilationErrors.spinner, Constants.iSpinnerTime);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: spinner visibile  after waiting 120 sec]";
				return false;	
			}

			//Click on terminal
			WebElement terminalclick = Global.driver.findElement(Locators.CompilationErrors.terminalinmultilanguage);
			JavascriptExecutor terminaljs = (JavascriptExecutor) Global.driver;
			terminaljs.executeScript("arguments[0].click();", terminalclick);

			//wait for terminal 
			bStatus = Wait.waitForElementVisibility(Global.driver,Locators.CompilationErrors.terminalinmultilanguage, Constants.twoSeconds);
			if(!bStatus) {
				WebElement terminaleditor = Global.driver.findElement(Locators.CompilationErrors.terminalinmultilanguage);
				JavascriptExecutor js4 = (JavascriptExecutor) Global.driver;
				js4.executeScript("arguments[0].click();",terminaleditor );
			}

			//Enter text in terminal 
			terminalclick.sendKeys("1 3"); 
			terminalclick.sendKeys(Keys.ENTER);

			//Wait for Execution results Box
			bStatus = Wait.waitForElementPresence(Global.driver,Locators.CompilationErrors.executionresults, Constants.fiveSeconds);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Excecution results not present after waiting five seconds ]";
				return false;
			}
			//Scroll to  Execution results Box
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,Locators.CompilationErrors.executionresults);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Not scrolled to compilationErrorslist ]";
				return false;
			}
			// Verify all test cases pass message in multi language question
			bStatus = Verify.verifyElementVisible(Global.driver,Locators.CompilationErrors.alltestcasesuccess);
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: All test cases are not succeeded]";
				return false;
			}
			//Click on Close Icon     
			WebElement closeicon = Global.driver.findElement(Locators.CompilationErrors.closeicon);
			JavascriptExecutor jscloseicon = (JavascriptExecutor) Global.driver;
			jscloseicon.executeScript("arguments[0].click();", closeicon);

			//Calling MultiLanguageText function to Verify text in editor
			bStatus = ApplicationFunctions.doverifyMultilanguageText(); 
			if(!bStatus) {
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@onclick='closeClicked()']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view Close button]";
				return false;
			}

			bStatus= CommonFunctions.jsClick (By.xpath("//span[@onclick='closeClicked()']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Close button is not clicked  ]";
				return false;
			}
			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//i[@class='fa fa-home']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Button is Not visible after waiting 10 sec  ]";
				return false;
			}
			bStatus= CommonFunctions.jsClick (By.xpath("//i[@class='fa fa-home']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Page button is not clicked  ]";
				return false;
			}
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
			// TODO: handle exception
		}
		return true;
	}
	//*********************Verify code text in Editor*************************//
	public static boolean doverifyMultilanguageText() {
		try {

			//Wait for MultiLanguage new Question
			bStatus= Wait.waitForElementVisibility(Global.driver, Locators.CompilationErrors.cerrnewquestion, Constants.thirtySeconds);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR ::Multierrnew Question is is not visible after waiting 30 sec]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,Locators.CompilationErrors.cerrnewquestion);
			//Click on MultiLanguage new Question
			bStatus = CommonFunctions.jsClick(Locators.CompilationErrors.cerrnewquestion);					
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on Multierrnew Question]";
				return false;
			}
			//Wait for question evalation
			bStatus= Wait.waitForElementVisibility(Global.driver,Locators.CompilationErrors.questionevaluation, Constants.thirtySeconds);	
			if(!bStatus) {
				Messages.errorMsg = "[ERROR :: Question evalation form not visible after waiting 30 sec]";
				return false;
			}
			// Get text of filename
			String attavale= Elements.getElementAttribute(Global.driver,Locators.CompilationErrors.filenameofmultilanguage , "filename");		
			System.out.println(attavale);

			// Verifying file name is null
			if(attavale==null) {
				Messages.errorMsg = "[ERROR :: Not able to get language type form file name]";
				return false; 
			}
			//Verifying file name not contains java
			if( !attavale.contains(".java")) {
				Messages.errorMsg = "[ERROR :: File Name not contain Java]";
				return false; 

			}
			JavascriptExecutor jsExecutor = (JavascriptExecutor) Global.driver;
			String editorid = Global.driver.findElement(By.xpath("//div[contains(@id,'compilationErrorEditor')][@filename]")).getAttribute("id");
			String editortext= (String) jsExecutor.executeScript("return ace.edit('"+editorid+"').getValue();");

			if(!editortext.contains("return c;")) {
				Messages.errorMsg = "[ERROR :: Input code is not Available after Reopen]";
				return false;
			}
			return true;

		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}

	}


	public static Map<String,String> doValidatequestionStatisticsInMember(Map<String,String>mapstatistics)
	{
		try
		{
			Map<String,String> mapdata = new HashMap<String, String>();
			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapstatistics.get("SubUnit")+"' and @qcount='"+mapstatistics.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapstatistics.get("SubUnit")+"]";
				return null;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapstatistics.get("SubUnit")+"' and @qcount='"+mapstatistics.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapstatistics.get("SubUnit")+"]";
				return null;
			}

			//wait for statistic button
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//button[@onclick='showQuestionStatisticsModal()']/i"), Constants.thirtySeconds);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: : Statistic button is not visible after waiting 30 sec]";
				return null;
			}


			//click on statistics button
			bStatus = CommonFunctions.jsClick(By.xpath("//button[@onclick='showQuestionStatisticsModal()']/i"));
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: Statistic button is not clicked]";
				return null;
			}
			bStatus = Wait.waitForElementVisibility(Global.driver, By.xpath("//h4[text()='Question Statistics']"), Constants.tenSeconds);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: Question Statistics Window is not displayed after waiting 10 sec]";
				return null;
			}
			if(mapstatistics.get("Functionality").equalsIgnoreCase("Statistics In Faculty")) {
				//wait for statistics pop up box
				bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//div[@id='groupNameSpan']//ul[@class='select2-choices']") , Constants.fiveSeconds);
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR :: Groups drop down page is not Visible]";
					return null;
				}
				//click on Groups drop down
				bStatus = CommonFunctions.jsClick(By.xpath("//div[@id='groupNameSpan']//ul[@class='select2-choices']"));
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR :: Groups drop down is not clicked]";
					return null;
				}

				Actions a = new Actions(Global.driver);
				a.sendKeys(Keys.ENTER).build().perform();


				//click on Fetch Statistics button
				bStatus = CommonFunctions.jsClick(By.xpath("//span[text()=' Fetch Statistics']"));
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR :: Fetch Statistics button is not clicked]";
					return null;
				}
			}


			bStatus= Verify.verifyElementVisible(Global.driver, By.id("statisticsTableDiv"));
			if(!bStatus)
			{
				bStatus = Wait.waitForElementVisibility(Global.driver, By.id("statisticsTableDiv"), Constants.twentySecond);
				if(!bStatus) {
					Messages.errorMsg = "[ERROR :: Statistics Table Data is not  Visible]";
					return null;
				}
			}

			ArrayList<String> list = new ArrayList<String>();
			list.add("Total Users");
			list.add("Average Time");
			list.add("Completed");
			list.add("In Progress");
			list.add("Not Started");
			for(int i=0;i<list.size();i++) {

				String keyname= list.get(i).toString();
				String keyValue= Elements.getText(Global.driver, By.xpath("//span[normalize-space()='"+keyname+"']/../div"));
				if(keyValue !=null) {
					mapdata.put(keyname,keyValue);
				}else {
					Messages.errorMsg = "[ ERROR :: Not able to get - "+keyname+" data from application. please check your locator]";
					return null;
				}
			}
			return mapdata;
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			return null;
		}

	}


	public static boolean doVerifyButtonsinEditor(Map<String,String>mapeditor){

		try {

			//scroll to view course
			bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[@subunitname='"+mapeditor.get("SubUnit")+"' and @qcount='"+mapeditor.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Not able to scroll to view  "+mapeditor.get("SubUnit")+"]";
				return false;
			}
			//click on course question
			bStatus = CommonFunctions.jsClick(By.xpath("//span[@subunitname='"+mapeditor.get("SubUnit")+"' and @qcount='"+mapeditor.get("Question No")+"']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Click not performed on "+mapeditor.get("SubUnit")+"]";
				return false;
			}

			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//span[@onclick='closeClicked()']"), Constants.sixtySeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Question Description page is not visible after waiting 60 sec ]";
				return false;
			}

			bStatus = CommonFunctions.scrollToWebElement(Global.driver,By.xpath("//label[text()='Correct/Complete the Code :']"));
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR :: not scrolled to editor]";
				return false;
			}


			if(mapeditor.get("Question Type").equalsIgnoreCase("Close with changes")) {
				WebElement editor = Global.driver.findElement(By.xpath("//textarea[@class='ace_text-input']"));
				JavascriptExecutor js = (JavascriptExecutor)Global.driver;
				js.executeScript("arguments[0].click();", editor);
				CommonFunctions.threadSleep(2);
				editor.sendKeys("InValid data");
			}

			if(mapeditor.get("Question Type").equalsIgnoreCase("Close with changes") ||mapeditor.get("Question Type").equalsIgnoreCase("Close without changes")) {
				//scroll to close button
				bStatus = CommonFunctions.scrollToWebElement(Global.driver,By.xpath("//span[@class='btn btn-warning closeBtn']"));
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR :: not scrolled to close button]";
					return false;
				}
				//wait for Close Button
				bStatus = Wait.waitForElementVisibility(Global.driver,By.xpath("//span[@class='btn btn-warning closeBtn']") , Constants.fiveSeconds);
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR :: Close Button is not Visible after waiting five sec]";
					return false;
				}
				//click on close
				bStatus = CommonFunctions.jsClick(By.xpath("//span[@class='btn btn-warning closeBtn']"));
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR :: close button clicked]";
					return false;
				}
			}
			if(mapeditor.get("Question Type").equalsIgnoreCase("Reset")){
				bStatus = CommonFunctions.scrollToWebElementside(Global.driver,By.xpath("//span[text()='Reset']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Not able to scroll to view  Reset button]";
					return false;
				}

				bStatus = CommonFunctions.jsClick(By.xpath("//span[text()='Reset']"));
				if (!bStatus) {
					Messages.errorMsg = "[ERROR :: Reset button is not clicked]";
					return false;
				}
			}
			bStatus = Verify.verifyAlertPresent(Global.driver);
			if(bStatus) {
				Global.driver.switchTo().alert().accept();
			}


			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//i[@class='fa fa-home']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Button is Not visible after waiting 10 sec  ]";
				return false;
			}
			bStatus= CommonFunctions.jsClick (By.xpath("//i[@class='fa fa-home']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Page button is not clicked  ]";
				return false;
			}
			return true;
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}


	public static boolean navigatehomePage() {
		try {
			Global.driver.navigate().refresh();
			bStatus= Wait.waitForElementVisibility(Global.driver, By.xpath("//i[@class='fa fa-home']"), Constants.tenSeconds);
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Button is Not visible after waiting 10 sec  ]";
				return false;
			}
			bStatus= CommonFunctions.jsClick (By.xpath("//i[@class='fa fa-home']"));
			if (!bStatus) {
				Messages.errorMsg = "[ERROR :: Home Page button is not clicked  ]";
				return false;
			}

			return true;
		}
		catch (Exception e) {
			return false;
		}
	}
}
