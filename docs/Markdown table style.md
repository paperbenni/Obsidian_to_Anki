# Usage

**[[Regex]] line:** `\|([^\n|]+)\|\n\|(?:[^\n|]+)\|\n\|([^\n|]+)\|\n?`

1. Create a file called `test.md`.
2. Paste the following contents into the file:

<pre>
| How do you use this style? |
| ---- |
| Just like this |

Of course, the script will ignore anything outside a table.

| Furthermore, the script | should also |
| ----- | ----- |
| Ignore any tables | with more than one column |

| Why might this style be useful? |
| --------- |
| It looks nice when rendered as HTML in a markdown editor. |
</pre>
## Obsidian Plugin users
3. In the plugin settings, paste the Regex line into the 'Custom Regexps' field associated with 'Basic'
4. Ensure that the 'Regex' option is checked
5. Click the Anki icon on the ribbon to run the plugin


## Python Script users
3. Run the script, and check 'Config' to open up the config file:  
![GUI](Images/GUI_config.png)
4. Navigate to the "Custom Regexps" section
5. Change the line
<pre>
Basic =  
</pre>
to  
<pre>
Basic = \|([^\n|]+)\|\n\|(?:[^\n|]+)\|\n\|([^\n|]+)\|\n?
</pre>
6. Save the config file
7. Run the script on the file, with 'Regex' checked:  
![GUI](Images/GUI_regex.png)

## All users
8. You should see these cards in Anki:  
![Table 1](Images/Table_1.png)  
![Table 2](Images/Table_2.png)