GENERA_FILES=(core models/base models/workspace-manager models/workspace models/panel models/layout)

tLen=${#GENERA_FILES[@]}
rm -f genera.js
touch genera.js
for (( i=0; i<${tLen}; i++ ));
do
    cat js/genera/${GENERA_FILES[$i]}.js >> genera.js
done

java -jar compiler.jar --jscomp_off globalThis --jscomp_off checkTypes --jscomp_off missingProperties --externs externs.txt --warning_level VERBOSE --js genera.js --js_output_file genera.min.js

rm -f genera.js
