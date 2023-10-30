
import asyncio
import json
import os
import csv

all_hfs_missing_parents = [
    ['HFR_code',"DATIM_Id","Region", "District", "HF_DATIM_Name", "HF_MOH_Name"]
]
async def convert_to_json(hf_csv_row, hf_reference):
    datim_id = hf_csv_row[6]
    hf = {
            "level": 7,
            "name": hf_csv_row[9],
            "openingDate": "1970-01-01",
            "id": datim_id,
            "shortName": (hf_csv_row[9])[0:50],
            "attributeValues": [
                {
                    "value": hf_csv_row[3],
                    "attribute": {
                    "id": "bv2eftIkSrm"
                    }
                },
                {
                    "value": hf_csv_row[5],
                    "attribute": {
                    "id": "XxZsKNpu4nB"
                    }
                },
                {
                    "value": hf_csv_row[5],
                    "attribute": {
                    "id": "jrZ74V1Lp2N"
                    }
                }
            ]
        }
    if datim_id in hf_reference:
        hf['parent'] =  {
                "id": hf_reference[datim_id]['parent']['id']
            }
        hf['openingDate'] = hf_reference[datim_id]['openingDate'][0:10]
    else:
        missing_parent_hfs = []
        print("HF ID can not be found from DATIM reference json")
        print(hf_csv_row[9])
        print(hf_csv_row[5])
        missing_parent_hfs.append(hf_csv_row[5])
        missing_parent_hfs.append(datim_id)
        missing_parent_hfs.append(hf_csv_row[7])
        missing_parent_hfs.append(hf_csv_row[8])
        missing_parent_hfs.append(hf_csv_row[9])
        missing_parent_hfs.append(hf_csv_row[3])
        all_hfs_missing_parents.append(missing_parent_hfs)
    return hf

async def get_hfs_from_hierarchy(hierachy):
    hfs = []
    for district in hierachy['children']:
        if 'children' in district and len(district['children']) > 0:
            for ward in district['children']:
                if 'children' in ward and len(ward['children']) > 0:
                    # HFs
                    for hf in ward['children']:
                        hfs.append(hf)
    return hfs


async def get_hf_reference_from_file(path):
    hf_parent_reference ={}
    with open(path + '/datim_tree_reference.json') as hf_ref_file:
        data = json.loads(hf_ref_file.read())
        # print(len(data))
        for region in data['children']:
            hfs = await get_hfs_from_hierarchy(region)
            for hf in hfs:
                hf_parent_reference[hf['id']] = hf
    return hf_parent_reference


async def get_hfs_from_csv(path):
    hfs = []
    with open(path + '/hfs.csv') as hf_file:
        csv_data = csv.reader(hf_file, delimiter=',')
        next(csv_data)
        for row in csv_data:
            hfs.append(row)
    return hfs

async def main():
    
    path = os.getcwd()
    # 1: Read HFs from CSV
    hfs_from_csv = await get_hfs_from_csv(path)
    hfs_reference = await get_hf_reference_from_file(path)
    print(json.dumps(hfs_reference))
    # 2. Read json reference
    # 3. Form HF to the defined json format
    converted_ous = []
    for hf_csv_row in hfs_from_csv:
        hf_json  = await convert_to_json(hf_csv_row, hfs_reference)
        converted_ous.append(hf_json)

    converted_json = {
        "organisationUnits": converted_ous
    }
    # Write to a file
    with open(path + "/converted_json.json", "w") as json_file:
        json_file.write(json.dumps(converted_json))
    
    with open(path + '/missing_parent_hfs.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            for row_data in all_hfs_missing_parents:
                writer.writerow(row_data)



asyncio.run(main())