// ===== WAIT FOR PAGE TO FULLY LOAD =====
// : Using jQuery's document.ready - this waits until all HTML, CSS, and images load before running code
// $(document).ready() means: "Hey browser, wait for everything to load, then do what's inside the brackets"
$(document).ready(function () {
    console.log(' Page ready! Now we can use all elements.');

    // ===== GET THE SUBMIT BUTTON =====
    // : Find the button on page that says "Submit & Book Demo"
    const submitBtn = $('#submitBtn');

    // : Get the form (the white box where user types)
    const form = $('#contactForm');

    // ===== GET ALL INPUT FIELDS =====
    // : Find all empty boxes where user types (name, email, etc.)
    const nameInput = form.find('input[name="name"]')[0];
    const mobileInput = form.find('input[name="mobile"]')[0];
    const emailInput = form.find('input[name="email"]')[0];
    const enquiryRadios = form.find('input[name="enquiry_type"]');
    const genderRadios = form.find('input[name="gender"]');
    const interestSelect = form.find('select[name="interest"]')[0];
    const dateInput = form.find('input[name="demo_date"]')[0];
    const timeSelect = form.find('select[name="time_slot"]')[0];
    const messageInput = form.find('textarea[name="message"]')[0];

    // ===== SET DEFAULT DATE TO TODAY (Initialize early) =====
    // : Show today's date in the calendar by default
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = year + '-' + month + '-' + day;

    dateInput.value = todayFormatted; // Set calendar to show today
    $(dateInput).attr('min', todayFormatted); // Don't allow past dates
    console.log('📅 Calendar set to: ' + todayFormatted);

    // ===== INITIALIZE FLATPICKR DATE PICKER (Beautiful Calendar) =====
    // : Replace default browser calendar with beautiful Flatpickr calendar
    flatpickr(dateInput, {
        enableTime: false,
        dateFormat: 'Y-m-d',
        minDate: 'today',
        defaultDate: todayFormatted,
        theme: 'light',
        static: false,
        inline: false,
        monthSelectorType: 'dropdown',
        shorthandCurrentMonth: false,
        locale: {
            firstDayOfWeek: 0
        }
    });

    // ===== RESET BUTTON HANDLER =====
    // : When user clicks "Clear Form" button, empty all fields but keep date to today
    const resetBtn = $('#resetBtn');

    if (resetBtn.length) {
        resetBtn.on('click', function (e) {
            e.preventDefault(); // IMPORTANT: Stop the default form reset behavior
            console.log('🔄 Form is being cleared...');

            // : Reset all form fields to empty
            form[0].reset();

            // : IMPORTANT: Set date back to today AFTER reset
            setTimeout(function() {
                dateInput.value = todayFormatted;
                console.log('📅 Date set to: ' + todayFormatted);
            }, 50);

            // : Check form again (button should be disabled) - without showing errors
            checkFormValidation(false);

            console.log(' Form cleared! Date set to today.');
        });
    }

    console.log(' Reset button is ready!');

    // ===== CHECK IF FIELD HAS TEXT =====
    // : Simple function - returns TRUE if field has something, FALSE if empty
    function isFieldFilled(field) {
        if (!field) return false; // If field doesn't exist, return false
        return field.value.trim() !== ''; // If has text, return true
    }

    // ===== CHECK IF EMAIL IS CORRECT =====
    // : Check if email looks like real email (has @ and dot)
    function isEmailValid(email) {
        return email.includes('@') && email.includes('.') && email.length > 5;
    }

    // ===== CHECK IF PHONE IS 10 DIGITS =====
    // : Check if phone number is exactly 10 numbers and contains only digits
    function isPhoneValid(phone) {
        return /^[0-9]{10}$/.test(phone) && phone.length === 10;
    }

    // ===== CHECK IF RADIO IS SELECTED =====
    // : Check if user clicked one of the radio buttons
    function isRadioSelected(radios) {
        return Array.from(radios).some(radio => radio.checked);
    }

    // ===== CHECK ALL FIELDS AND ENABLE/DISABLE BUTTON =====
    // : Main function - checks EVERYTHING and turns button ON or OFF
    function checkFormValidation(showErrors = false) {
        // : Start by thinking button should be ON
        let allFieldsOk = true;

        // ===== HELPER FUNCTION: Show/Hide error message as Bootstrap alert =====
        function showError(field, show, errorMessage) {
            const feedback = $(field).parent().find('.invalid-feedback');
            if (show && showErrors) { // Only show if showErrors flag is true
                $(field).addClass('is-invalid');
                $(field).removeClass('is-valid');
                // Show Bootstrap-styled error alert below the field
                if (feedback.length) {
                    feedback.show();
                    // Add Bootstrap alert styling
                    feedback.removeClass('invalid-feedback').addClass('invalid-feedback alert alert-danger py-2 px-3 mt-2 mb-0 d-block');
                    feedback.html('<i class="fas fa-exclamation-circle me-2"></i>' + errorMessage);
                }
            } else {
                $(field).removeClass('is-invalid');
                // Only show valid state if errors are being shown
                if (showErrors) {
                    $(field).addClass('is-valid');
                } else {
                    $(field).removeClass('is-valid');
                }
                if (feedback.length) {
                    feedback.hide();
                    feedback.removeClass('invalid-feedback alert alert-danger py-2 px-3 mt-2 mb-0 d-block').addClass('invalid-feedback');
                }
            }
        }

        // CHECK 1: Is name filled and not more than 50 characters?
        if (!isFieldFilled(nameInput)) {
            allFieldsOk = false;
            showError(nameInput, true, 'Please enter your name');
        } else if (nameInput.value.length > 50) {
            allFieldsOk = false;
            showError(nameInput, true, 'Name should not exceed 50 characters');
        } else {
            showError(nameInput, false, '');
        }

        // CHECK 2: Is mobile filled AND is it 10 digits?
        if (!isFieldFilled(mobileInput) || !isPhoneValid(mobileInput.value)) {
            allFieldsOk = false;
            showError(mobileInput, true, 'Please enter a valid 10 digit mobile number');
        } else {
            showError(mobileInput, false, '');
        }

        // CHECK 3: Is email filled AND does it look like real email?
        if (!isFieldFilled(emailInput) || !isEmailValid(emailInput.value)) {
            allFieldsOk = false;
            showError(emailInput, true, 'Please enter a valid email address');
        } else {
            showError(emailInput, false, '');
        }

        // CHECK 4: Is enquiry type selected?
        if (!isRadioSelected(enquiryRadios)) {
            allFieldsOk = false;
        }

        // CHECK 5: Is gender selected?
        if (!isRadioSelected(genderRadios)) {
            allFieldsOk = false;
        }

        // CHECK 6: Is interest selected?
        if (!isFieldFilled(interestSelect)) {
            allFieldsOk = false;
            showError(interestSelect, true, 'Please select an option');
        } else {
            showError(interestSelect, false, '');
        }

        // CHECK 7: Is date selected?
        if (!isFieldFilled(dateInput)) {
            allFieldsOk = false;
            showError(dateInput, true, 'Please select a valid date (today or future)');
        } else {
            showError(dateInput, false, '');
        }

        // CHECK 8: Is time slot selected?
        if (!isFieldFilled(timeSelect)) {
            allFieldsOk = false;
            showError(timeSelect, true, 'Please select a time slot');
        } else {
            showError(timeSelect, false, '');
        }

        // CHECK 9: Is message filled and not more than 300 characters?
        if (!isFieldFilled(messageInput)) {
            allFieldsOk = false;
            showError(messageInput, true, 'Please enter your message');
        } else if (messageInput.value.length > 300) {
            allFieldsOk = false;
            showError(messageInput, true, 'Message should not exceed 300 characters');
        } else {
            showError(messageInput, false, '');
        }

        // ===== NOW ENABLE OR DISABLE BUTTON =====
        // : If all checks passed, turn button GREEN and ON
        // If any check failed, turn button GRAY and OFF
        if (allFieldsOk) {
            submitBtn.prop('disabled', false); // Button is now clickable
            submitBtn.css('opacity', '1'); // Button is bright
            submitBtn.css('cursor', 'pointer'); // Show hand cursor
            console.log(' ALL FIELDS OK! BUTTON ENABLED!');
        } else {
            submitBtn.prop('disabled', true); // Button is not clickable
            submitBtn.css('opacity', '0.6'); // Button is faded
            submitBtn.css('cursor', 'not-allowed'); // Show blocked cursor
            console.log(' Some fields missing! BUTTON DISABLED!');
        }
    }

    // ===== LISTEN FOR CHANGES IN ALL FIELDS =====
    // : Every time user types or clicks something, check if button should be ON/OFF
    $(nameInput).on('input', function () {
        checkFormValidation(false);
    });

    $(mobileInput).on('input', function () {
        // : Remove any non-digit characters in real-time
        this.value = this.value.replace(/[^0-9]/g, '');
        checkFormValidation(false);
    });

    // : Prevent pasting non-digits into mobile field
    $(mobileInput).on('paste', function (e) {
        setTimeout(() => {
            this.value = this.value.replace(/[^0-9]/g, '');
            checkFormValidation(false);
        }, 10);
    });

    $(emailInput).on('input', function () {
        checkFormValidation(false);
    });

    $(interestSelect).on('change', function () {
        checkFormValidation(false);
    });

    $(dateInput).on('change', function () {
        checkFormValidation(false);
    });

    $(timeSelect).on('change', function () {
        checkFormValidation(false);
    });

    $(messageInput).on('input', function () {
        // Update character counter for message field
        const charCount = this.value.length;
        $('#charCount').text(charCount);
        checkFormValidation(false);
    });

    // : For radio buttons, check when user clicks them
    enquiryRadios.on('change', function () {
        checkFormValidation(false);
    });

    genderRadios.on('change', function () {
        checkFormValidation(false);
    });

    // ===== CHECK WHEN PAGE FIRST LOADS =====
    // : When page opens, button should be OFF (gray) because fields are empty
    // Don't show errors yet - only on submit
    checkFormValidation(false);
    console.log(' Form checker is working!');

    // : If user picks past date, show error (disabled by Flatpickr, but keeping as fallback)
    $(dateInput).on('change', function () {
        if (this.value < todayFormatted) {
            this.value = todayFormatted; // Reset to today
        }
        checkFormValidation(false); // Re-check form without showing errors
    });

    // ===== SMOOTH SCROLL =====
    // : When user clicks link like "About Me", page scrolls smoothly instead of jumping
    $('a[href^="#"]').on('click', function (e) {
        const targetId = $(this).attr('href');
        if (targetId !== '#') {
            const targetSection = $(targetId);
            if (targetSection.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: targetSection.offset().top
                }, 800, 'swing');
            }
        }
    });
    console.log(' Smooth scroll working!');

    // ===== CLOSE MOBILE MENU WHEN CLICKING LINK =====
    // : On phone, when user clicks a link, hide the menu
    const mobileMenu = $('.navbar-collapse');
    $('.navbar-nav a').on('click', function () {
        if ($(window).width() < 992) {
            mobileMenu.removeClass('show');
        }
    });
    console.log(' Mobile menu close working!');

    // ===== FORM SUBMIT HANDLER =====
    // : Handle form submission with validation
    form.on('submit', function (e) {
        e.preventDefault(); // stop default form submission

        // : Check validation with errors showing
        checkFormValidation(true);

        // : Check if all fields are valid before submitting
        let isValid = true;
        if (!isFieldFilled(nameInput) || !isFieldFilled(mobileInput) || !isPhoneValid(mobileInput.value) ||
            !isFieldFilled(emailInput) || !isEmailValid(emailInput.value) || !isRadioSelected(enquiryRadios) ||
            !isRadioSelected(genderRadios) || !isFieldFilled(interestSelect) || !isFieldFilled(dateInput) ||
            !isFieldFilled(timeSelect) || !isFieldFilled(messageInput)) {
            isValid = false;
        }

        // If form is not valid, stop submission
        if (!isValid) {
            console.log(' Form has errors, please fix them');
            return;
        }

        // : Get all form data
        const formData = new FormData(form[0]);

        // : Convert FormData to JSON object
        const formObject = Object.fromEntries(formData);

        // : Show loading message
        console.log('📤 Submitting form via AJAX...');

        // ===== JQUERY AJAX REQUEST =====
        // : Send form data to the server without reloading page
        $.ajax({
            type: 'POST',
            url: 'https://formspree.io/f/xgonbdaa', // Formspree endpoint
            dataType: 'json',
            data: formObject, // Send form data
            success: function (response) {
                // : Form submitted successfully
                console.log(' Form submitted successfully!', response);

                // Show Bootstrap success alert
                const successAlert = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <i class="fas fa-check-circle"></i> <strong>Success!</strong> Form submitted successfully! We will contact you within 24 hours.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                $('#alertBox').html(successAlert).fadeIn(300);

                // Clear the form after 3 seconds
                setTimeout(function () {
                    form[0].reset();
                    checkFormValidation(false);
                    $('#alertBox').fadeOut(500, function () {
                        $(this).html('').hide();
                    });
                }, 5000);
            },
            error: function (error) {
                // : Show error message if submission fails
                console.log(' Error submitting form:', error);

                // Show Bootstrap danger alert
                const errorAlert = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fas fa-exclamation-triangle"></i> <strong>Error!</strong> Something went wrong. Please try again!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                $('#alertBox').html(errorAlert).fadeIn(300);
            }
        });
    });

    console.log('🎉🎉🎉 ALL SCRIPTS LOADED AND WORKING! 🎉🎉🎉');

    // ===== MODAL FORM HANDLING =====
    // : Set up the same validation logic for the modal contact form
    const modalForm = $('#contactFormModal');
    const submitBtnModal = $('#submitBtnModal');
    const demoDateModal = $('#demoDateModal');
    
    if (modalForm.length) {
        // Set default date to today for modal form
        demoDateModal.val(todayFormatted);
        demoDateModal.attr('min', todayFormatted);
        
        // ===== INITIALIZE FLATPICKR FOR MODAL DATE PICKER =====
        flatpickr(demoDateModal[0], {
            enableTime: false,
            dateFormat: 'Y-m-d',
            minDate: 'today',
            defaultDate: todayFormatted,
            theme: 'light',
            static: false,
            inline: false,
            monthSelectorType: 'dropdown',
            shorthandCurrentMonth: false,
            locale: {
                firstDayOfWeek: 0
            }
        });
        
        // Character counter for modal message field
        $(modalForm).find('textarea[name="message"]').on('input', function () {
            const charCount = this.value.length;
            $('#charCountModal').text(charCount);
        });
        
        // Enable submit button when form is valid
        $(modalForm).find('input, select, textarea').on('change input', function () {
            const modalNameInput = modalForm.find('input[name="name"]').val().trim();
            const modalMobileInput = modalForm.find('input[name="mobile"]').val().trim();
            const modalEmailInput = modalForm.find('input[name="email"]').val().trim();
            const modalDateInput = modalForm.find('input[name="demo_date"]').val();
            const modalTimeInput = modalForm.find('select[name="time_slot"]').val();
            const modalMessageInput = modalForm.find('textarea[name="message"]').val().trim();
            const modalMobileValid = /^\d{10}$/.test(modalMobileInput);
            const modalEmailValid = /^[^@]+@[^@]+\.[^@]+$/.test(modalEmailInput);
            
            if (modalNameInput && 
                modalMobileValid && 
                modalEmailValid && 
                modalDateInput && 
                modalTimeInput && 
                modalMessageInput) {
                submitBtnModal.prop('disabled', false);
            } else {
                submitBtnModal.prop('disabled', true);
            }
        });
        
        // Modal form submit handler
        modalForm.on('submit', function (e) {
            e.preventDefault();
            
            // Add Bootstrap validation classes
            if (!this.checkValidity() === false) {
                e.stopPropagation();
            }
            
            // Show loading state
            submitBtnModal.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Submitting...');
            
            // Send form via AJAX
            $.ajax({
                url: modalForm.attr('action'),
                type: 'POST',
                data: modalForm.serialize(),
                dataType: 'json',
                success: function (data) {
                    // Show success alert
                    const successAlert = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <i class="fas fa-check-circle"></i> <strong>Success!</strong> Your request has been received. We will contact you shortly!
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    $('#alertBoxModal').html(successAlert).fadeIn(300);
                    
                    // Reset form
                    modalForm[0].reset();
                    demoDateModal.val(todayFormatted);
                    $('#charCountModal').text('0');
                    submitBtnModal.prop('disabled', true).html('<i class="fas fa-paper-plane"></i> Submit & Schedule');
                    
                    // Close modal after 2 seconds
                    setTimeout(function () {
                        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
                        modalInstance.hide();
                        $('#alertBoxModal').fadeOut(300);
                    }, 2000);
                },
                error: function (error) {
                    const errorAlert = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="fas fa-exclamation-triangle"></i> <strong>Error!</strong> Please try again.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    $('#alertBoxModal').html(errorAlert).fadeIn(300);
                    submitBtnModal.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Submit & Schedule');
                }
            });
        });
    }
});
