from rxconfig import config
import reflex as rx
import json
import os

class FormState(rx.State):
    form_data: dict = {}

    @staticmethod
    def handle_submit(form_data: dict):
        """Handle the form submit."""
        # Save form_data to the class attribute
        FormState.form_data = form_data
        # Call the function to save data to a JSON file
        FormState.save_to_json(form_data)

    @staticmethod
    def save_to_json(data: dict):
        """Save submitted data to a JSON file."""
        json_filename = f"{config.app_name}/submissions.json"
        if not os.path.isfile(json_filename):
            with open(json_filename, "w") as file:
                json.dump([], file)  # Create the file with an empty list

        with open(json_filename, "r+") as file:
            submissions = json.load(file)
            submissions.append(data)
            file.seek(0)
            file.truncate()  # Clear the file before writing the updated submissions list
            json.dump(submissions, file, indent=4)

def form_example():
    state = FormState()

    return rx.vstack(
        rx.form(
            rx.vstack(
                rx.input(
                    placeholder="First Name",
                    name="first_name",
                ),
                rx.input(
                    placeholder="Last Name",
                    name="last_name",
                ),
                rx.hstack(
                    rx.checkbox("Checked", name="check"),
                    rx.switch("Switched", name="switch"),
                ),
                rx.button("Submit", type="submit"),
            ),
            on_submit=lambda form_data: state.handle_submit(form_data),
            reset_on_submit=True,
        ),
        rx.divider(),
        rx.heading("Results"),
        # Since form_data is a dictionary, we need to properly format it for display
        rx.text(json.dumps(FormState.form_data, indent=2)),
    )

app = rx.App()
app.add_page(form_example)