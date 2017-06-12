# ATM track editor manual

##Table of Contents

0. [First things first](#head0)

1. [Start your first song](#head1)
1.1 [Create your first Tune](#head2)
1.2 [Set the first Channel FX](#head3)
1.3 [Create your first drum part](#head4)
1.4 [Create your first Track FX](#head5)

2. [SAVE LOAD EXPORT SHOW CODE of a song](#head6)
2.1 [SAVE a song](#head7)
2.2 [LOAD a song](#head8)
2.3 [EXPORT a song](#head9)
2.4 [SHOW CODE of a song](#head10)

3. [REPEAT a song, or a part of a song](#head11)

4. [Each FX in the editor explained](#head12)
4.1 SET TEMPO
4.2 ADD TEMPO
4.3 SET VOLUME
4.4 SLIDE VOLUME ON
4.5 SLIDE VOLUME ADVANCED
4.6 SLIDE VOLUME OFF
4.7 SLIDE FREQUENCY ON
4.8 SLIDE FREQUENCY ADVANCED
4.9 SLIDE FREQUENCY OFF
4.10 SET ARPEGGIO
4.11 ARPEGGIO OFF
4.12 SET TRANSPOSITION
4.13 ADD TRANSPOSITION
4.14 TRANSPOSITION OFF
4.15 SET TREMOLO
4.16 TREMOLO OFF
4.17 SET VIBRATO
4.18 VIBRATO OFF
4.19 SET GLISSANDO
4.20 GLISSANDO OFF
4.21 SET NOTE CUT
4.22 NOTE CUT OFF

## <a name="head0"></a>0. First things first
Our ATM editor offers a way to creat music for the ATM library. The library is capable of a lot more than what the editor can give you. For example, the editor can only add FX on channel level or track level. The ATM library can also handle FX on each seperate note being played. An other example is repetition. The editor will automaticly use the "repeat track FX" when you put the same track multitple times, one after the other. It will not do this if you for exmaple alternate tracks, altough being a repition too.

The ATM library is capable of stacking 7 levels deep. So if you create a song manually, you can compress the already dense code even more. You can manually create repititions of repititions or even stack FX paterns.

If you want to read more on the library itself, you should take a look at [the github page for ATMlib](https://github.com/TEAMarg/ATMlib). This page holds the real limitations of the ATM library itself.


##<a name="head1"></a>1. Start your first song

###<a name="head2"></a>1.1 Create your first Tune
When you open the editor for the first time you'll get an empty view of the **SONG EDITOR** and an empty **TRACK LIST**. The song editor has 4 channels, each with its fixed instrument, which can not be changed. Channel 0 = pulse, Channel 1 = square, Channel 2 = triangle, Channel 3 = noise. In the song editor, you can only put tune tracks on ch0, ch1 and ch2. Drum tracks can only be put on ch3.

So start with pressing **new tune track** and you'll get an extra window, the **TUNE TRACK EDITOR** which includes a vertical piano roll, a name field, a channel field (this is only used for testing the track) and the size of the track in ticks with a maximum of 64 ticks. You can just click a place on the piano roll and drag for activating notes.

As good practice you should use 4 ticks for each note. Adjacent ticks of the same tone are automatically connected, So if you want seperate notes of the same tone, make the note 3 ticks long. the shortested note is 1 tick, the longest is 64 ticks (track lenght). Ch 3 is a low power instrument, meaning you will need to use the higher notes to hear anything at all. Low notes don't work well on __triangle waves__

Once you created a track, you can drag&drop it into the **SONG EDITOR**. You can use the same track more than once, also on different channels.

###<a name="head3"></a>1.2 Set the first Channel FX
When starting a new song, all channels are **muted** by default and the **tempo** is set to 24, by an FX on channel 0. If you have put a track on a channel, and press play, you won't hear anything (ch0, ch1, ch2). Click on the word FX at the end of each track, to see the applied FX for each of the channels. By clicking on a FX name in the __AVAILABLE FX__ window you can add an FX. Clicking the pencil next to an FX in the __USED FX__ window, will open it in the __SETTINGS FX__ windows for you to edit it.

You should start with adding **SET VOLUME** FX for each channel (ch0, ch1, ch2) you will be putting tracks on. Set the volume at 48 (max 64) if you're using all 4 channels. If you go louder, ou might get distortion. If you prefer, you can change the **SET TEMPO** FX on channel 0.

If you want an instrument to play fading notes, you should add the FX **SLIDE VOLUME** and put a negative value, like -12. This means every tick, the volume will go down by 12. So the volume starts at 48 and 4 ticks later it will be 0. BUT on every new note the volume will be reset to the orginal amount, set by the FX **SET VOLUME**.

###<a name="head4"></a>1.3 Create your first drum part
The ATM player and editor have only 1 drum track available, channel 3, a noise channel. The **DRUM TRACK EDITOR** includes a horizontal track, a name field and the size of the track in ticks with a maximum of 64 ticks. The drum instruments are limited to the ones listed. The arrow indicates the select drum part. Just click on the track at the place you want to insert the selected drum part. Click again to remove it.

Now that you created a drum track, you can drag&drop the track to channel 3. You can use the same track more than once. Adding FX to the drum channel or track don't really have much infuence on the sound.

###<a name="head5"></a>1.4 Create your first Track FX
If you created a tune track and have dropped it on the **SONG EDITOR**, you'll see the letters FX in the track bar. You can add an FX to every individual track you added to the **SONG EDITOR**. Adding FX works the same way as Channel FX. But effects set on track level only influence the track itself. An FX on channel level will still influence the track too. For example you can repeat a certain number of times and use SET VOLUME with an increasing value for each indiviual track. This will create the effect of a fading in of a complete track. 

##<a name="head6"></a>2. SAVE LOAD EXPORT SHOW CODE of a song

###<a name="head7"></a>2.1 SAVE a song
If you want to preserve a song, to be able to work on it on a different moment or to exchange with other musicians, it's best to save it. Just press the "save button", give your song a name, keep the .atm extension and you're done.


###<a name="head8"></a>2.2 LOAD a song
If you want to continu on an "saved" song that has the .atm extension, you can "load" it by pressing the "load button"

###<a name="head9"></a>2.3 EXPORT a song
If you want to import a song into your game code, it's best to export the song. press the "export song button" and the editor will create a song_export.h file. This file can be used to be put along your other files of your game. You can also use this file to play it with the [ATM webplayer](https://teamarg.github.io/ATMwebplayer/).

If you want to have multiple songs in the same files, you'll have to copy paste them manually into your song.h file. Don't forget to rename "Song music[]" into a different name for each song, if you put more than 1 song in a song data file.

###<a name="head10"></a>2.4 SHOW CODE of a song
While creating a song, you can immediately see how the data will look, by pressing the "show code button". If the code is showing and you change stuff in the song, tune tracks, drum tracks or FX, you'll have to close and reopen the "show code" window.

You could also use this window to copy paste the song data into the file with (other) song data you already have.

This is a readonly window, so you can paste song data into the window to edit an existing song. If you want to work on an existing song, you'll need an .atm file (not an .h file) We are not planning on creating an .h to .atm converter, because a song can hold complexer song data, the ATM editor is not capable of creating.

##<a name="head11"></a>3. REPEAT a song, or a part of a song
If you want the song to autorepeat, after it's finished, first check the "repeat song" checkmark. If would like the song to repeat from a cartain point in your song, you should move the devider line in the **SONG EDITOR** to the beginning of the tracks you want the song to start repeating from.

It is very important to know, that the tracks in ALL 4 channels have to start a the exact same point ! If your devider line is set in the middle of a track, repeating the song will fail !

The ATM editor has a simple way of adding in "repeat song". The ATM library itself is capable of repeating your song in a more complex way, but needs to be coded manually.

##<a name="head12"></a>4. Each FX explained





