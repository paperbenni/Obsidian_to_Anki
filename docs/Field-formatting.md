Apart from the first field, each field must have a prefix to indicate to the program which field to add text into. The prefix is a colon (":") added onto the field name. For example:

<pre>
START
Basic
Front: This is a test.
Back: Test successful!
END
</pre>

This produces the following card in Anki:

![](Pasted%20image%2020201206185831.png)

You can omit the prefix for the first field for convenience:

<pre>
START
Basic
This is a test.
Back: Test successful!
END
</pre>

And you can continue on a new line for the same field:

<pre>
START
Basic
This is a test.
And the test is continuing.
Back: Test successful!
END
</pre>

![](Pasted%20image%2020201206193521.png)

You must start each new field on a new line. But otherwise you are free to omit as many or as few fields as you wish, or change up the order of fields!