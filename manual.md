# ATM track editor manual

##1. Start your first song

###1.1 Create your first tune
When you open the editor for the first time you'll get an empty view of the **SONG EDITOR** and an empty **TRACK LIST**. The song editor has 4 channels, each with its fixed instrument, which can not be changed. Channel 0 = pulse, Channel 1 = square, Channel 2 = triangle, Channel 3 = noise. In the song editor, you can only put tune tracks on ch0, ch1 and ch2. Drum tracks can only be put on ch3.

So start with pressing **new tune track** and you'll get an extra window, the **TUNE TRACK EDITOR** which includes a vertical piano roll, a name field, a channel field (this is only used for testing the track) and the size of the track in ticks with a maximum of 64 ticks. You can just click a place on the piano roll and drag for activating notes.

As good practice you should use 4 ticks for each note. Adjacent ticks of the same tone are automatically connected, So if you want seperate notes of the same tone, make the note 3 ticks long. the shortested note is 1 tick, the longest is 64 ticks (track lenght). Ch 3 is a low power instrument, meaning you will need to use the higher notes to hear anything at all. Low notes don't work well on __triangle waves__

Once you created a track, you can drag&drop it into the **SONG EDITOR**. You can use the same track more than once, also on different channels.

###1.2 Set the first Channel FX
When starting a new song, all channels are **muted** by default and the **tempo** is set to 24, by an FX on channel 0. If you have put a track on a channel, and press play, you won't hear anything (ch0, ch1, ch2). Click on the word FX at the end of each track, to see the applied FX for each of the channels. By clicking on a FX name in the __AVAILABLE FX__ window you can add an FX. Clicking the pencil next to an FX in the __USED FX__ window, will open it in the __SETTINGS FX__ windows for you to edit it.

You should start with adding **SET VOLUME** FX for each channel (ch0, ch1, ch2) you will be putting tracks on. Set the volume at 48 (max 64) if you're using all 4 channels. If you go louder, ou might get distortion. If you prefer, you can change the **SET TEMPO** FX on channel 0.

If you want an instrument to play fading notes, you should add the FX **SLIDE VOLUME** and put a negative value, like -12. This means every tick, the volume will go down by 12. So the volume starts at 48 and 4 ticks later it will be 0. BUT on every new note the volume will be reset to the orginal amount, set by the FX **SET VOLUME**.

###1.3 Create your first drum part
The ATM player and editor have only 1 drum track available, channel 3, a noise channel. The **DRUM TRACK EDITOR** includes a horizontal track, a name field and the size of the track in ticks with a maximum of 64 ticks. The drum instruments are limited to the ones listed. The arrow indicates the select drum part. Just click on the track at the place you want to insert the selected drum part. Click again to remove it.

Now that you created a drum track, you can drag&drop the track to channel 3. You can use the same track more than once. Adding FX to the drum channel or track don't really have much infuence on the sound.

###1.4 Create your first Track FX
If you created a tune track and have dropped it on the **SONG EDITOR**, you'll see the letters FX in the track bar. You can add an FX to every individual track you added to the **SONG EDITOR**. Adding FX works the same way as Channel FX. But effects set on track level only influence the track itself. An FX on channel level will still influence the track too. For example you can repeat a certain number of times and use SET VOLUME with an increasing value for each indiviual track. This will create the effect of a fading in of a complete track. 

##2. SAVE LOAD EXPORT a song

###2.1 SAVE a song

###2.2 LOAD a song

###2.3 EXPORT a song