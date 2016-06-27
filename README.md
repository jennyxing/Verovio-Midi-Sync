# Verovio-Midi-Sync

Demo: http://www4.iath.virginia.edu/mei/Verovio_Midi_Sync/MIDIPlayer.html

I will be integrating conversion to MIDI from MEI into Verovio, then synchronizing the MIDI playback with the rendered SVG visually with the Verovio Javascript toolkit. This project will be done using C++, Javascript, and SVG. It will utilize the Midifile tool written by Craig Sapp to write the MIDI files (https://github.com/craigsapp/midifile). This library has already been integrated into the Verovio codebase by Laurent Pugin. 


The finished product will look very similar to http://musicbox.sapp.org/examples/chopin/op28n01/ (this does not use Verovio), created using the Javascript library scoreFollowsAudio (source code available https://github.com/Freischuetz-Digital/scoreFollowsAudio) 


Progress on this project on the Verovio side can be seen at https://github.com/rism-ch/verovio/tree/develop-midi. 


Below is a breakdown of the steps that will be taken to complete the project, with projected timeframes for each step. This project will be completed by the end of April 2016. 


1)	Creating a dummy file from Verovio (already completed)
The command-line tool needs to be modified to accept midi as an output format. If this option is selected, a method will be called that will create dummy midi file and write to it.


2)	Generating a MIDI file from MEI in Verovio (by the end of February)
The method created in the above step will be modified to process the input MEI file and add the appropriate notes to the MIDI file. This will involve processing the note element and other relevant elements to create a MIDI event that will be written to the file.


3)	Generating a MIDI file that can be read from the JS interface (by the middle of March)
Another method will be written that will allow the MIDI file created in the previous step to be read by Javascript.


4)	Write a player that can play the MIDI file and issue a callback (by the end of March)
The callback may be implemented in a similar way as in scoreFollowsAudio, where a JSON file contains parameters linking the timestamps of MIDI events with the measure numbers and SVG coordinates.


5)	Allow Verovio to respond to that callback and process it (by the middle of April)


6)	Make the player handle the callback response (by the end of April)
Steps involving Verovio (1, 2, 5) will be done in C++ and the rest will be done in Javascript. 
The exact plans for the last 4 steps have not yet been determined. I will update this as I work on the project discuss it with Laurent in the future. 
