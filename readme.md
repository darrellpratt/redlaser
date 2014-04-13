## mp_EXTRACT.txt

echo 'prd_id|pod_id|prdc_key|dol|units' | cat - mp_EXTRACT.txt > temp && mv temp mp_EXTRACT.txt


sed -i .bak 's/|/,/g' mp_EXTRACT.txt

type:sale_fact

## mp_prdc_ref.txt

echo 'prdc_key|prdc_code|be_high|ctg_dfl_nm|brn_high|C_2030305280|C_403177472|BRN_LOW|C_1483472896|C_17301504|C_1610874880|RL_PRDC_NAME|RL_PRDC_CODE' | cat - mp_prdc_ref.txt > temp && mv temp mp_prdc_ref.txt

sed -i.bak 's/|/,/g' mp_prdc_ref.txt


## mp_str_ref.txt

echo 'pod_id|lrtacode|ltraname|sorgcd|spsuedocd|sname|sstreetadd|scity|sst|szip|sareacd|sphoneno|slat|slong|sformatcd|mmgbmktnm|sno|store_id|area_phone' | cat - mp_str_ref.txt > temp && mv temp mp_str_ref.txt

sed -i.bak 's/|/,/g' mp_str_ref.txt

type: store_ref



## Views

function (doc, meta) {
  if (doc.type == 'sales_fact') {
    emit(meta.id, [doc.prd_id, (doc.dol * doc.units)]);  
  }
}


function (doc, meta) {
  if (doc.type == 'sales_fact' && doc.dol > 0) {
    var res = meta.id.split("_");
    emit(res[1], [(doc.dol / doc.units),res[0]]);  
  }
}


function (doc, meta) {
  if (doc.type == 'sales_fact' && doc.dol > 0) {
    var res = meta.id.split("_");
    emit([res[1],res[0],res[2]], (doc.dol / doc.units));  
  }
}



-95.1742,37.7767,-83.00996,46.7699

-122.5091,28.2183,-111.81584,37.2116


function(doc, meta) {
    if (doc.type == "store_ref") {
      emit( {  type: "Point",  coordinates: [doc.slong, doc.slat], }, doc.pod_id );
    }
}



"45.23995","-68.05340059","36.246754","-79.9324934"