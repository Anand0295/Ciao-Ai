// Test file with some issues for Ciao AI to detect
const password = "hardcoded123"; // This should trigger security warning

function longFunction() {
    console.log("This is a very long line that exceeds 120 characters and should trigger a line length warning from our analyzer");
    
    if (true) {
        if (true) {
            if (true) {
                if (true) {
                    if (true) {
                        console.log("Deep nesting detected"); // This should trigger nesting warning
                    }
                }
            }
        }
    }
}

// SQL injection vulnerability
const query = "SELECT * FROM users WHERE id = " + userId;

longFunction();