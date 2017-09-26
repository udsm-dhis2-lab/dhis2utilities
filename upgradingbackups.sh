#!/bin/bash
# -*- coding: utf-8 -*-
#
#       Select Records.sh
#       
#       Copyright 2011 John Francis Mukulu <john.f.mukulu@gmail.com>
#       
#       This program is free software; you can redistribute it and/or modify
#       it under the terms of the GNU General Public License as published by
#       the Free Software Foundation; either version 2 of the License, or
#       (at your option) any later version.
#       
#       This program is distributed in the hope that it will be useful,
#       but WITHOUT ANY WARRANTY; without even the implied warranty of
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#       GNU General Public License for more details.
#       
#       You should have received a copy of the GNU General Public License
#       along with this program; if not, write to the Free Software
#       Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#       MA 02110-1301, USA.
#       
#       

set -e
set -u
PSQL=/usr/bin/psql
now="$( echo "$( date )" | sed 's/\ /_/g' )"
FILEPATH="/your/destination/path/"
FILENAME="yourfilename_${now}.csv"
CSVFILE="${FILEPATH}${FILENAME}"
PGUSER=dbusername
PGHOST=localhost
PGPASSWORD="yourdbpassword"
DATABASE="yourdbname"
SELECTQUERY="SELECT id,instance,firstname,middlename,surname,dob,dob_year,age,sex,basic_education_level,edu_evel,check_no,confirmation_date,confirmation_date_year,contact,contact_of_next_of_kin,disability,domicile,email,employer,file_no,first_appointment,first_appointment_year,hosp_dept,hosp_salary_scale,hosp_superlative_post,nationality,next_kin,number_of_children,reg_no,relation_next_kin,agedistribution,retirementdistribution,designation,superlative,salary,last_promo,department,employment_status,religion,salary_scale,employment_terms,employmentduration,profession,retirementdate,retirementdate_year,employmentdistribution,marital,hosp_designation,level1_mohsw,level2_categories,level3_regions_departments_institutions_referrals,level4_districts_reg_hospitals,level5_facility,type,ownership,organisationunit_name,form_name,lastupdated FROM _resource_all_fields ORDER BY level1_mohsw,level2_categories,level3_regions_departments_institutions_referrals,level4_districts_reg_hospitals,level5_facility";
# @Workaround: User Password free backup.
export PGUSER PGPASSWORD
$PSQL -X -h $PGHOST -U $PGUSER -d $DATABASE -t -c "COPY($SELECTQUERY) TO '${CSVFILE}' WITH CSV HEADER;";
cd $FILEPATH
sudo zip -9 -P hrhisFor2016  "${CSVFILE}".zip "${FILENAME}" && sudo rm "${CSVFILE}"
