# Cookie-setting Script

It's not very convenient to cut and paste cookie variables from calling
_schema.fcgi_ with login credentials, so the following script will automate
the process so you can concentrate on debugging response modes that assume
running sessions or logins.

After entering the following text, make sure that you _chmod_ to set the execution
flags.

Bash script/EMACS bonus: the EMACS file variables **-*-** notation is normally on
the first line, but for shell scripts where the first line identifies the script
interpreter, EMACS will look to the second line for the file variables line.

~~~sh
#!/bin/bash
-*- mode: shell -*-

# Clear any previous cookies
export HTTP_COOKIE=''

# Set credentials (specific for example response mode):
em=youremail@gmail.com
pw=yourpassword

# Replace the following line with your specific login call,
# note that stderr is redirected to /tmp/liresult.txt
schema.fcgi -s login.srm -m login_submit -v email=${em} -v pword=${pw} 2> /tmp/liresult.txt

# Save stderr to variable and clean up
liresult=$(</tmp/liresult.txt)
rm /tmp/liresult.txt

# Start building the HTTP_COOKIE command

echo -n 'export HTTP_COOKIE="'

while read -r line; do
   if [[ "$line" =~ Set-Cookie:\ (.*) ]]
   then
       if [ -n "$found" ]; then
           echo -n '; '
       fi
       found=1
       echo -n ${BASH_REMATCH[1]}
   fi
done <<< "$liresult"

# Close quotes and add newline to complete the command:
echo '"'
~~~