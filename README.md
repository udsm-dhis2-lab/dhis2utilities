# NACP_Support: Data Alignment Activiy (DAA)

# Overview
This activity involves aligning MoH PEPFAR indicators with DATIM data, matching selected indicators from PEPFAR-supported facilities in the DATIM system to the comprehensive MoH Database encompassing all health facilities.

## Files and their description

1. create_json_for_datim_dhis2.py
- It is python file with a script to convert a CSV File to a JSON file, explicitly arranging facilities in an hierarchy(parent & it's child) importable in JSON file. 

2. converted_json.json
- This is the output of the python script written in the file(1), from this file we have a complete list of facilities importable into DATIM system that are in a JSON format

3. datim_tree_reference.json
- This is a list of facilities that were currently present in the DATIM facility while before the script was written, the file was used to counter check integrity of facilities i.e., it's location, it's name and it's associated HFR code against facilties from the hfs.csv file

4. hfs.csv
- This file contains facilities from DATIM that have been updated against the facilties from DHIS, this file is used as an input to the python script written in the file(1) i.e, create_json_for_datim_dhis2.py so that we can later have an output file having facilities in JSON format i.e., converted_json.json

5. missing_parent_hfs.csv
- This file hold exception to the facilities that misses parent i.e., ward/councils in a csv format for ease of read

## How to run the script
 To run the script ensure your device is configured with the following
- Python dependencies
- Virtual environment is enabled for an isolation of dependencies, version Management, dependency reproducibility, ease of Collaboration, avoiding System-wide Changes, Cleaner Project Structure, Easy Cleanup
- To create a virtual environment, you can use tools like venv (built into Python 3) or virtualenv. Once the virtual environment is set up, you can activate it, and any subsequent Python commands will use the isolated environment, ensuring that the project's dependencies are managed independently of the global Python environment.

- Start a new terminal on your device, navigate to this folder location on your device, make sure you're on a right branch i.e., create-json incase you have cloned this repo
- Specify a file i.e., "create_json_for_datim_dhis2.py" leave space and specify what kind of file you want to run i.e., "py"
- The file will run the containing script and output the result file in the specified file i.e., converted_json.json

PS
- For any update in the datim_facilties CSV provided, simply replace the newly aligned facilities with the one's in the hfs.csv file, ensuring they follow the existing column arrangements