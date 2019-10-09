const URL = process.argv[2];
// const credentials = process.argv[3];
const typeOfRequest = process.argv[4];
const https = require('https');
const fs = require('fs');

const request = require('request');

const facilities = [
  {
    "id": "DtYX6cVz0ys",
    "name": "Miyenze Dispensary",
    "code": "109727-8"
  },
  {
    "id": "zZyGa74ftLE",
    "name": "Bukombe District Hospital",
    "code": "100511-5"
  },
  {
    "id": "GPR6Kojhlrl",
    "name": "Bugando Dispensary",
    "code": "100437-3"
  },
  {
    "id": "qDAc5O8FaTX",
    "name": "Kabuhima Bakwata No 1 Dispensary",
    "code": "109702-1"
  },
  {
    "id": "YntobdMucQT",
    "name": "Butinzya KMT Dispensary",
    "code": "111362-0"
  },
  {
    "id": "SSuTfOTv5Qd",
    "name": "Wazazi Msonga Dispensary",
    "code": "108343-5"
  },
  {
    "id": "mwz9kovvv0I",
    "name": "Luganga Dispensary",
    "code": "111671-4"
  },
  {
    "id": "Jz3FnaiBajd",
    "name": "Bakwata No 3 Dispensary",
    "code": "110373-8"
  },
  {
    "id": "I8VzBe6z0pZ",
    "name": "Magulundinga Health Center",
    "code": "103996-5"
  },
  {
    "id": "EtC7apvCZlV",
    "name": "TMRC Lyobahika Dispensary",
    "code": "111672-2"
  },
  {
    "id": "jfdblqA7N6t",
    "name": "Bulega Health Center",
    "code": "100531-3"
  },
  {
    "id": "JfO10qsaCDB",
    "name": "Wazazi Dillu Dispensary",
    "code": "109349-1"
  },
  {
    "id": "HDkJLEP35DG",
    "name": "Iyogelo Dispensary",
    "code": "102042-9"
  },
  {
    "id": "Ma5D1vv15Oh",
    "name": "Wazazi Nkomo Dispensary",
    "code": "109197-4"
  },
  {
    "id": "NL9rRnQDl9w",
    "name": "Uyovu Health Center",
    "code": "108233-8"
  },
  {
    "id": "lZ4yTNGCAJY",
    "name": "Ushirombo Health Center",
    "code": "108177-7"
  },
  {
    "id": "FNJ6AilH26U",
    "name": "Ikuzi Dispensary",
    "code": "101696-3"
  },
  {
    "id": "PfMoC8pCSwx",
    "name": "Bukombe Dispensary",
    "code": "100510-7"
  },
  {
    "id": "WOreJnpt98Q",
    "name": "Bugelenga Dispensary",
    "code": "100449-8"
  },
  {
    "id": "MmDu4ASkkJp",
    "name": "Kafita Dispensary",
    "code": "102154-2"
  },
  {
    "id": "pbRXWEgS1p8",
    "name": "Kharumwa Health Center",
    "code": "102551-9"
  },
  {
    "id": "q1WSCCMgSRR",
    "name": "Nyangalamila Dispensary",
    "code": "106763-6"
  },
  {
    "id": "H8CQNC75lHi",
    "name": "Lyulu Dispensary",
    "code": "103804-1"
  },
  {
    "id": "QdYYGKB2cd1",
    "name": "Nyijundu Dispensary",
    "code": "106852-7"
  },
  {
    "id": "WMwu3BhlzSo",
    "name": "Kayenze Dispensary",
    "code": "102515-4"
  },
  {
    "id": "pUl44N4VIdr",
    "name": "Bukwimba Dispensary",
    "code": "100524-8"
  },
  {
    "id": "R8Pwvua23uL",
    "name": "Kitongo Dispensary",
    "code": "103189-7"
  },
  {
    "id": "LKU3P8L6wwU",
    "name": "Kharumwa Jumuia ya Wazazi Dispensary",
    "code": "109564-5"
  },
  {
    "id": "AkAuOJBZFjP",
    "name": "Busolwa Dispensary",
    "code": "100607-1"
  },
  {
    "id": "z09VcKN4g7h",
    "name": "Shabaka Dispensary",
    "code": "107386-5"
  },
  {
    "id": "lNlu5pFW6tz",
    "name": "Nyang`hwale Health Center",
    "code": "106770-1"
  },
  {
    "id": "BGb4mw86D0K",
    "name": "Kabiga Dispensary",
    "code": "102138-5"
  },
  {
    "id": "cLBuTV5fDLN",
    "name": "Mwigiro Dispensary",
    "code": "106023-5"
  },
  {
    "id": "FILwIK6fScX",
    "name": "Nyungwa Dispensary",
    "code": "106860-0"
  },
  {
    "id": "F7pS3dXi1LK",
    "name": "Ilyamchele Dispensary",
    "code": "109718-7"
  },
  {
    "id": "OgX9RCxv7sP",
    "name": "Mkulima Dispensary",
    "code": "105125-9"
  },
  {
    "id": "l6Vtsvf0Pgi",
    "name": "Ilemela Dispensary",
    "code": "101734-2"
  },
  {
    "id": "O6b2nz421VS",
    "name": "Nyabugera Dispensary",
    "code": "106636-4"
  },
  {
    "id": "h1bXSUXDQw1",
    "name": "Butarama Health Center",
    "code": "109819-3"
  },
  {
    "id": "eYPZS5xKY6f",
    "name": "Kasenga Dispensary",
    "code": "102417-3"
  },
  {
    "id": "IJj3qw4WR0F",
    "name": "Bahimba Dispensary",
    "code": "109193-3"
  },
  {
    "id": "PbCWJ92Pemw",
    "name": "KMT Buziku Dispensary",
    "code": "111135-0"
  },
  {
    "id": "e6qtqN9JAx4",
    "name": "Busaka Dispensary",
    "code": "100580-0"
  },
  {
    "id": "vDzhybyusIT",
    "name": "Ichwankima Dispensary",
    "code": "101466-1"
  },
  {
    "id": "lkjb9zVIPnw",
    "name": "Nyabilezi Dispensary",
    "code": "106632-3"
  },
  {
    "id": "BFCSb2CfEFK",
    "name": "Butengorumasa Dispensary",
    "code": "109747-6"
  },
  {
    "id": "VZPAc7HawOf",
    "name": "Nyantimba Dispensary",
    "code": "106790-9"
  },
  {
    "id": "ywgeDC2Im2i",
    "name": "Kigongo Dispensary",
    "code": "102721-8"
  },
  {
    "id": "BDVbHIzSN9H",
    "name": "Katete Dispensary",
    "code": "102475-1"
  },
  {
    "id": "DN0KloW15wL",
    "name": "Chato District Hospital",
    "code": "100751-7"
  },
  {
    "id": "VoVqvLeQ4W3",
    "name": "Ihanga Dispensary",
    "code": "101607-0"
  },
  {
    "id": "f0d6ApKQFia",
    "name": "Kachwamba Health Center",
    "code": "102150-0"
  },
  {
    "id": "CUXkACfAQUV",
    "name": "St. Joseph Dispensary",
    "code": "107596-9"
  },
  {
    "id": "FKLx91Rt8hv",
    "name": "Kinsabe Dispensary",
    "code": "111371-1"
  },
  {
    "id": "AuDgroJ84TW",
    "name": "Muungano Health Center",
    "code": "109903-5"
  },
  {
    "id": "sznaEz4eXWO",
    "name": "Buzirayombo Dispensary",
    "code": "100640-2"
  },
  {
    "id": "GtRSIJdEqSo",
    "name": "Nyambiti Dispensary",
    "code": "106709-9"
  },
  {
    "id": "lbjMuyvB7d9",
    "name": "Huruma Dispensary",
    "code": "111370-3"
  },
  {
    "id": "kdMdd5Lrj6X",
    "name": "Urafiki Prinmat Dispensary",
    "code": "111136-8"
  },
  {
    "id": "Fl2qU0W3d1z",
    "name": "Mutundu Dispensary",
    "code": "111643-3"
  },
  {
    "id": "THxCtcSLSLv",
    "name": "Kibumba Dispensary",
    "code": "102626-9"
  },
  {
    "id": "iarTtB55yr5",
    "name": "Kibehe Dispensary",
    "code": "102592-3"
  },
  {
    "id": "e7XKw14dM9K",
    "name": "Upendo Dispensary",
    "code": "108126-4"
  },
  {
    "id": "vAFkbjEad8x",
    "name": "Kasala Dispensary",
    "code": "102393-6"
  },
  {
    "id": "CpZ2VJULt6G",
    "name": "Buseresere Dispensary",
    "code": "109820-1"
  },
  {
    "id": "LpZivNah8ob",
    "name": "Nyamirembe Dispensary",
    "code": "106733-9"
  },
  {
    "id": "l7lzaYMXhMP",
    "name": "Bwanga Health Center",
    "code": "100650-1"
  },
  {
    "id": "IGduwj8UTw4",
    "name": "Katende Dispensary",
    "code": "102470-2"
  },
  {
    "id": "UKjOuALFJrj",
    "name": "Mkungo Dispensary",
    "code": "105138-2"
  },
  {
    "id": "zoEzdaJ0xNO",
    "name": "Buziku Dispensary",
    "code": "100638-6"
  },
  {
    "id": "hcaLt7jcijL",
    "name": "BAKWATA SHAMSIYA Dispensary",
    "code": "100248-4"
  },
  {
    "id": "gpjnC7dwTOw",
    "name": "Makurugusi Dispensary",
    "code": "104145-8"
  },
  {
    "id": "zFt8dHHQcqc",
    "name": "Iparamasa Dispensary",
    "code": "101824-1"
  },
  {
    "id": "Yvgm2RrR4JA",
    "name": "Nyakafuru Dispensary",
    "code": "106654-7"
  },
  {
    "id": "Fbrojg9lRhk",
    "name": "Bwelwa Dispensary",
    "code": "100655-0"
  },
  {
    "id": "GFtVEDeq1nu",
    "name": "Nyanhwiga Dispensary",
    "code": "106779-2"
  },
  {
    "id": "aBgsy4JMSTd",
    "name": "Ilolangulu Dispensary",
    "code": "101751-6"
  },
  {
    "id": "qGCXXcIOAPx",
    "name": "Wazazi Mwenzetu Dispensary",
    "code": "108345-0"
  },
  {
    "id": "dWr9heErem2",
    "name": "Lubeho Dispensary",
    "code": "103610-2"
  },
  {
    "id": "PYDlpuRyWsr",
    "name": "Ikunguigazi Dispensary",
    "code": "101686-4"
  },
  {
    "id": "XlgUH9nhKtO",
    "name": "Tumaini Dispensary",
    "code": "109787-2"
  },
  {
    "id": "w4j2SxHPpd2",
    "name": "Ilangale Dispensary",
    "code": "109139-6"
  },
  {
    "id": "ugktbiz7Jdh",
    "name": "Iboya Health Center",
    "code": "101450-5"
  },
  {
    "id": "bbxDAZhn0wT",
    "name": "Iponya Dispensary",
    "code": "101836-5"
  },
  {
    "id": "Kd8rk9vzPjV",
    "name": "Lugunga Dispensary",
    "code": "103655-7"
  },
  {
    "id": "qVxjSgkAzMa",
    "name": "Ushirika Dispensary",
    "code": "108175-1"
  },
  {
    "id": "PZOIfyVtYAk",
    "name": "Nyang`holongo Dispensary",
    "code": "106768-5"
  },
  {
    "id": "QxSLxFjGymL",
    "name": "Masumbwe Health Center",
    "code": "104429-6"
  },
  {
    "id": "esVHe4YL3Dj",
    "name": "Nyasato Dispensary",
    "code": "106820-4"
  },
  {
    "id": "sjIVSpdPdm6",
    "name": "Lulembela Wazazi Dispensary",
    "code": "108337-7"
  },
  {
    "id": "wvKBPnS1gti",
    "name": "St. Peter Dispensary",
    "code": "107623-1"
  },
  {
    "id": "hleqhOzV9E0",
    "name": "Upendo Health Center",
    "code": "108127-2"
  },
  {
    "id": "gQGlsqRpOKa",
    "name": "Tumaini Dispensary",
    "code": "107920-1"
  },
  {
    "id": "Ze7dROiQPmL",
    "name": "Kasamwa SDA Dispensary",
    "code": "102395-1"
  },
  {
    "id": "HhLREq61UhR",
    "name": "Sakam Dispensary",
    "code": "107236-2"
  },
  {
    "id": "Q1QSrANkjZo",
    "name": "Geita Town Council HTC Clinic",
    "code": "111560-9"
  },
  {
    "id": "o1ZMxl8dU7X",
    "name": "Sabeeve Prinmart Clinic",
    "code": "111235-8"
  },
  {
    "id": "dOJjQ2XPPrk",
    "name": "Florida Prinmat Dispensary",
    "code": "111234-1"
  },
  {
    "id": "ALp5m1RiWUY",
    "name": "Ndunguru Dispensary",
    "code": "106284-3"
  },
  {
    "id": "xxYk0nGN11d",
    "name": "Samartan Dispensary",
    "code": "111238-2"
  },
  {
    "id": "Gq8uAlBaSTs",
    "name": "Msufini Dispensary",
    "code": "111233-3"
  },
  {
    "id": "LeCDlDGb4HW",
    "name": "Bulela Dispensary",
    "code": "100533-9"
  },
  {
    "id": "NP5YykgafJQ",
    "name": "Nyakabale Dispensary",
    "code": "106696-8"
  },
  {
    "id": "Q9Sq8VWGCoJ",
    "name": "Geita Prison Dispensary",
    "code": "111559-1"
  },
  {
    "id": "IKODCqVFtnY",
    "name": "GGM Health Center",
    "code": "101193-1"
  },
  {
    "id": "eASTKULAl1C",
    "name": "Nyankumbu Health Center",
    "code": "106785-9"
  },
  {
    "id": "gKGXEOK6d8K",
    "name": "Bung`wangoko Dispensary",
    "code": "100576-8"
  },
  {
    "id": "BQLQj0IpcNC",
    "name": "Geita TMC Dispensary",
    "code": "111240-8"
  },
  {
    "id": "QlV0FhW438Z",
    "name": "Vatican Dispensary",
    "code": "111248-1"
  },
  {
    "id": "mpgNcZjQ6YG",
    "name": "Bunegezi Dispensary",
    "code": "100569-3"
  },
  {
    "id": "da5ID8Vj5q9",
    "name": "Nyakaduha Dispensary",
    "code": "106653-9"
  },
  {
    "id": "toEAUwskVZI",
    "name": "Bukoli Health Center",
    "code": "100509-9"
  },
  {
    "id": "X4wx4S2pgpD",
    "name": "Magereza Butundwe Dispensary",
    "code": "111561-7"
  },
  {
    "id": "xDlhAy2KLiK",
    "name": "Izumacheli Dispensary",
    "code": "111504-7"
  },
  {
    "id": "YXGRcy34WX8",
    "name": "Lisabon Dispensary",
    "code": "109733-6"
  },
  {
    "id": "ox7TqFAysei",
    "name": "Chibingo Dispensary",
    "code": "100776-4"
  },
  {
    "id": "BA9QUsf7cxE",
    "name": "Katoro Health Center",
    "code": "102484-3"
  },
  {
    "id": "p6ozpHXA7Xf",
    "name": "Bukondo Dispensary",
    "code": "100513-1"
  },
  {
    "id": "a7PjFwrboES",
    "name": "Ibondo Dispensary",
    "code": "111503-9"
  },
  {
    "id": "nISbG1GszJG",
    "name": "Lwenzera Dispensary",
    "code": "103788-6"
  },
  {
    "id": "ChWNG1gviz6",
    "name": "Kishinda Dispensary",
    "code": "103101-2"
  },
  {
    "id": "s72yIFyPQA2",
    "name": "Chigunga Dispensary",
    "code": "100791-3"
  },
  {
    "id": "sQSAnsZTRza",
    "name": "Buziba Dispensary",
    "code": "100637-8"
  },
  {
    "id": "sxHEKw8lRJZ",
    "name": "Ndelema Dispensary",
    "code": "106245-4"
  },
  {
    "id": "psnIoluH0ZJ",
    "name": "Ihega Dispensary",
    "code": "101615-3"
  },
  {
    "id": "WHGWhKFQIOR",
    "name": "Mico Dispesnasry",
    "code": "109691-6"
  },
  {
    "id": "hxB4pfNfYXR",
    "name": "Lwamgasa Dispensary",
    "code": "103781-1"
  },
  {
    "id": "YVPoCt9DSxW",
    "name": "Busanda Dispensary",
    "code": "100585-9"
  },
  {
    "id": "PrdUzIKsUNX",
    "name": "Kagu Dispensary",
    "code": "102174-0"
  },
  {
    "id": "WagXeKS2TsY",
    "name": "Kifufu Dispensary",
    "code": "102681-4"
  },
  {
    "id": "v4037JPZOhe",
    "name": "Fulwe Dispensary",
    "code": "101158-4"
  },
  {
    "id": "YCkRghusoAw",
    "name": "Nyarugusu Dispensary",
    "code": "106806-3"
  },
  {
    "id": "fwhWu3VU3k4",
    "name": "Nkome Dispensary",
    "code": "106534-1"
  },
  {
    "id": "ZVxIYDLdolO",
    "name": "Chikobe Health Center",
    "code": "100798-8"
  },
  {
    "id": "Qi5hfxO2uPR",
    "name": "Nyumbani Dispensary",
    "code": "109301-2"
  },
  {
    "id": "oN6zmcq6T53",
    "name": "Isima Dispensary",
    "code": "101913-2"
  },
  {
    "id": "FtJqTX23mro",
    "name": "Senga Dispensary",
    "code": "107366-7"
  },
  {
    "id": "e5ZEB1oEmMI",
    "name": "Kaseme Dispensary",
    "code": "102415-7"
  },
  {
    "id": "ZcW2XiASlDN",
    "name": "Kashishi Health Center",
    "code": "102433-0"
  },
  {
    "id": "vgxSnsLcYQ9",
    "name": "TMRC Katoro Dispensary",
    "code": "111589-8"
  },
  {
    "id": "QecvQYc3EI6",
    "name": "Rubondo Dispensary",
    "code": "103613-6"
  },
  {
    "id": "HmeYSixic8M",
    "name": "Buyagu Dispensary",
    "code": "100627-9"
  },
  {
    "id": "ukKBGen3Cec",
    "name": "Nzera Health Center",
    "code": "106871-7"
  },
  {
    "id": "e2qj36x7xJL",
    "name": "Mwamitilwa Dispensary",
    "code": "105886-6"
  },
  {
    "id": "a2YI36iNbRv",
    "name": "Nyakagwe Dispensary",
    "code": "106655-4"
  },
  {
    "id": "RC1b3MkGBpM",
    "name": "Mnekezi Dispensary",
    "code": "105686-0"
  },
  {
    "id": "rMXzIa1vuwY",
    "name": "Mharamba Dispensary",
    "code": "104801-6"
  },
  {
    "id": "vlmyYkCewKv",
    "name": "Lubanga Dispensary",
    "code": "103609-4"
  },
  {
    "id": "BaDu82uoh05",
    "name": "Nyalwanzaja Dispensary",
    "code": "111505-4"
  },
  {
    "id": "SVd33uDRABJ",
    "name": "Msasa Dispensary",
    "code": "105440-2"
  },
  {
    "id": "rZAC3wENWZO",
    "name": "Kakubilo Dispensary",
    "code": "102213-6"
  },
  {
    "id": "NYSip8AwV2H",
    "name": "Nyamalimbe Dispensary",
    "code": "106697-6"
  },
  {
    "id": "XRqUIe8Bgfb",
    "name": "Kasang`wa Dispensary",
    "code": "102404-1"
  },
  {
    "id": "IDQeT9LwLvK",
    "name": "Kasota Dispensary",
    "code": "109270-9"
  },
  {
    "id": "MmmEkyWU5fz",
    "name": "Katoro TCMC Dispensary",
    "code": "102486-8"
  },
  {
    "id": "P1dnJ5q56XV",
    "name": "Nyamwilolelwa Dispensary",
    "code": "111507-0"
  },
  {
    "id": "nQIzI8ViDnD",
    "name": "Bugulula Dispensary",
    "code": "100461-3"
  },
  {
    "id": "rEjRVQ5CzEM",
    "name": "Sisi kwa Sisi Dispensary",
    "code": "111456-0"
  },
  {
    "id": "mlBirc4mUMd",
    "name": "Katoma Dispensary",
    "code": "102482-7"
  },
  {
    "id": "wRhVqLSS0y8",
    "name": "Mashule Dispensary",
    "code": "108669-3"
  },
  {
    "id": "zkqRI2ypcwe",
    "name": "Rwamulumba Dispensary",
    "code": "107197-6"
  },
  {
    "id": "SIIUSz2TaU9",
    "name": "Kibirizi Dispensary",
    "code": "102606-1"
  },
  {
    "id": "b2plt9uVBW6",
    "name": "Bwizanduru Dispensary",
    "code": "100665-9"
  },
  {
    "id": "bUt2Hoew2ts",
    "name": "Bujugo Dispensary",
    "code": "108671-9"
  },
  {
    "id": "Kt1iQEJIY2r",
    "name": "Kishanje Health Center",
    "code": "103098-0"
  },
  {
    "id": "jLExVOzxL3o",
    "name": "Katoma Dispensary",
    "code": "102480-1"
  },
  {
    "id": "yifHOD69SWi",
    "name": "Kihumulo Dispensary",
    "code": "102751-5"
  },
  {
    "id": "TuzO1MkNX45",
    "name": "Nyakabanga Dispensary",
    "code": "108670-1"
  },
  {
    "id": "UWS6EZb3ySx",
    "name": "Kyamalange Dispensary",
    "code": "103422-2"
  },
  {
    "id": "o5wTW4imRnK",
    "name": "Katare Dispensary",
    "code": "102466-0"
  },
  {
    "id": "z2h0lCfkIwO",
    "name": "Ruhunga Dispensary",
    "code": "107144-8"
  },
  {
    "id": "cRGQAldWOkx",
    "name": "Butainamwa Dispensary",
    "code": "100617-0"
  },
  {
    "id": "rSOcEuFKjRY",
    "name": "Bushasha Dispensary",
    "code": "100597-4"
  },
  {
    "id": "S66T46pkgq9",
    "name": "WAMATA Dispensary",
    "code": "108668-5"
  },
  {
    "id": "JxtN1jJk21A",
    "name": "Mikoni Dispensary",
    "code": "104910-5"
  },
  {
    "id": "yCPO3I0Dfto",
    "name": "Kalema Dispensary",
    "code": "102233-4"
  },
  {
    "id": "q3pnM8XDjyy",
    "name": "Bulinda Dispensary",
    "code": "100540-4"
  },
  {
    "id": "kYZ8JqG5xDC",
    "name": "Kashozi Health Center",
    "code": "102436-3"
  },
  {
    "id": "kLRYQWVawTr",
    "name": "Bulila Dispensary",
    "code": "108707-1"
  },
  {
    "id": "fB7Se4BaZfM",
    "name": "Kishogo Dispensary",
    "code": "103104-6"
  },
  {
    "id": "DvDZaaosT6L",
    "name": "Ibosa Dispensary",
    "code": "101448-9"
  },
  {
    "id": "zFjZTzAGp2j",
    "name": "Maruku Dispensary",
    "code": "104358-7"
  },
  {
    "id": "VN3HTkcNNKo",
    "name": "Kanazi Health Center",
    "code": "102305-0"
  },
  {
    "id": "MFGO6Q0arEh",
    "name": "Ntoma Dispensary",
    "code": "108712-1"
  },
  {
    "id": "KsECsynnhcQ",
    "name": "Kaibanja Dispensary",
    "code": "102191-4"
  },
  {
    "id": "CXcUrqTHGx5",
    "name": "Buzi Dispensary",
    "code": "100636-0"
  },
  {
    "id": "PObLZ61CYel",
    "name": "Kaagya Dispensary",
    "code": "102123-7"
  },
  {
    "id": "eiHvae9b2hX",
    "name": "Rugaze Dispensary",
    "code": "107134-9"
  },
  {
    "id": "uXmasojJYZ3",
    "name": "Rubale Health Center",
    "code": "107122-4"
  },
  {
    "id": "awoj0mGlGux",
    "name": "Nyakibimbili Dispensary",
    "code": "106674-5"
  },
  {
    "id": "KakNB9JQsgU",
    "name": "Ibwera Dispensary",
    "code": "101461-2"
  },
  {
    "id": "brLMw5rc31r",
    "name": "Katoro Health Center",
    "code": "102485-0"
  },
  {
    "id": "sHEJspcBMAP",
    "name": "Ikunyu Dispensary",
    "code": "101692-2"
  },
  {
    "id": "PVLKQjrbDXz",
    "name": "Kikomelo Dispensary",
    "code": "108672-7"
  },
  {
    "id": "hTacU1yp5PL",
    "name": "Nsheshe Dispensary",
    "code": "106581-2"
  },
  {
    "id": "AGkfbdSUpCs",
    "name": "Kabale Dispensary",
    "code": "102126-0"
  },
  {
    "id": "eTWaLBqPKwA",
    "name": "Kyamulaile Dispensary",
    "code": "103423-0"
  },
  {
    "id": "jH6Te8kyJsi",
    "name": "Tumaini Dispensary",
    "code": "107921-9"
  },
  {
    "id": "WCAHgIO0380",
    "name": "Nyamigogo Dispensary",
    "code": "106723-0"
  },
  {
    "id": "HNBhnNQPUvm",
    "name": "23 KJ Dispensary",
    "code": "108548-9"
  },
  {
    "id": "uSUh8ABTLuo",
    "name": "Kasozibakaya Dispensary",
    "code": "102447-0"
  },
  {
    "id": "lytY9MLaDQ9",
    "name": "Rukaragata Health Center",
    "code": "107149-7"
  },
  {
    "id": "cWfwUaGuJ2I",
    "name": "Nyamahanga Dispensary",
    "code": "106691-9"
  },
  {
    "id": "TSY5TiOaaG4",
    "name": "Nyabusozi Health Center",
    "code": "106642-2"
  },
  {
    "id": "utDOeJGNuSP",
    "name": "Nyantakara Dispensary",
    "code": "106789-1"
  },
  {
    "id": "eWBV6ouivbN",
    "name": "Kaniha Dispensary",
    "code": "102326-6"
  },
  {
    "id": "Ypt2baIpj2D",
    "name": "Kalenge Dispensary",
    "code": "102242-5"
  },
  {
    "id": "mFVVsKjSIjH",
    "name": "Nyambale Dispensary",
    "code": "109827-6"
  },
  {
    "id": "LbzspC7Byms",
    "name": "Mkunkwa Dispensary",
    "code": "108725-3"
  },
  {
    "id": "zFodLUif3ZN",
    "name": "Nyabugombe Dispensary",
    "code": "106637-2"
  },
  {
    "id": "GXhiVjhHPn5",
    "name": "Kikomakoma Dispensary",
    "code": "102783-8"
  },
  {
    "id": "unlZpj1g4id",
    "name": "MAGEREZA Dispensary",
    "code": "108604-0"
  },
  {
    "id": "IPELoJxWODK",
    "name": "Ruganzu Dispensary",
    "code": "107132-3"
  },
  {
    "id": "u0hNkZBkYaS",
    "name": "Ngararambe Dispensary",
    "code": "109807-8"
  },
  {
    "id": "OElXHmX0kzk",
    "name": "Runazi Dispensary",
    "code": "107156-2"
  },
  {
    "id": "exjpmEqOFYA",
    "name": "Nyakahura Health Center",
    "code": "106658-8"
  },
  {
    "id": "c4SPRtfyxSI",
    "name": "Katoke Dispensary",
    "code": "102478-5"
  },
  {
    "id": "ZepS0NoTYeI",
    "name": "St. Clara Dispensary",
    "code": "108750-1"
  },
  {
    "id": "rE6jzPjyT2C",
    "name": "St. OTTO Dispensary",
    "code": "107619-9"
  },
  {
    "id": "XogKJUQn6L5",
    "name": "Biharamulo Hospital",
    "code": "100361-5"
  },
  {
    "id": "FLjL8Z6yl5l",
    "name": "Mayday Clinic",
    "code": "108745-1"
  },
  {
    "id": "ivio9nR8yRn",
    "name": "Stamigold Biharamulo Mine Dispensary",
    "code": "108547-1"
  },
  {
    "id": "kIb7MZiQJ19",
    "name": "Katahoka Dispensary",
    "code": "102459-5"
  },
  {
    "id": "kfIdrIwKLJf",
    "name": "Mbindi Dispensary",
    "code": "104615-0"
  },
  {
    "id": "uzWTiGhbCPr",
    "name": "Mavota Dispensary",
    "code": "104500-4"
  },
  {
    "id": "wOdRJpoIKhi",
    "name": "Nyakanazi Dispensary",
    "code": "106660-4"
  },
  {
    "id": "Nn86jqltFoC",
    "name": "Lusahunga Dispensary",
    "code": "103747-2"
  },
  {
    "id": "HTB6tAhmn3W",
    "name": "Kyerwa Dispensary",
    "code": "103433-9"
  },
  {
    "id": "xPH7IUJFMnO",
    "name": "Karongo Dispensary",
    "code": "108579-4"
  },
  {
    "id": "wbrrvEogjwS",
    "name": "Kihinda Dispensary",
    "code": "108546-3"
  },
  {
    "id": "mhEM2EPI0Co",
    "name": "Kibingo Dispensary",
    "code": "102603-8"
  },
  {
    "id": "lG5Mv85HYCC",
    "name": "Kikukuru Dispensary",
    "code": "102793-7"
  },
  {
    "id": "XjxwJXBk9ps",
    "name": "Ibamba Dispensary",
    "code": "101432-3"
  },
  {
    "id": "SaNPBXFcl8d",
    "name": "Kimuli Dispensary",
    "code": "102917-2"
  },
  {
    "id": "S1M6FgtTHuq",
    "name": "Mabira Dispensary",
    "code": "103821-5"
  },
  {
    "id": "fyeo8kjWvRd",
    "name": "Bugara Dispensary",
    "code": "108716-2"
  },
  {
    "id": "pE2ZgEkTbOy",
    "name": "Rwenkende Dispensary",
    "code": "107204-0"
  },
  {
    "id": "p5GkdhIq7GU",
    "name": "Nkwenda Health Center",
    "code": "106558-0"
  },
  {
    "id": "zJEqtCbSSSG",
    "name": "Ruhita Dispensary",
    "code": "108634-7"
  },
  {
    "id": "ZIhhPZGu8Ok",
    "name": "Businde Dispensary",
    "code": "100604-8"
  },
  {
    "id": "ajIvOQwuQFU",
    "name": "Nyakatera Dispensary",
    "code": "106666-1"
  },
  {
    "id": "lvdVpXMYQlN",
    "name": "Rwele Dispensary",
    "code": "107202-4"
  },
  {
    "id": "NHgn5gAYcms",
    "name": "Nyakatuntu Dispensary",
    "code": "106671-1"
  },
  {
    "id": "Gx51uJ66qaP",
    "name": "Murongo Health Center",
    "code": "105705-8"
  },
  {
    "id": "z7v4k5aHo0v",
    "name": "Kigorogoro Dispensary",
    "code": "108551-3"
  },
  {
    "id": "xprfnqGk0u4",
    "name": "Kakanja Dispensary",
    "code": "102202-9"
  },
  {
    "id": "V98gH9TGfti",
    "name": "Kibimba Dispensary",
    "code": "102600-4"
  },
  {
    "id": "mIMumpPGO3D",
    "name": "Kaisho Dispensary",
    "code": "102195-5"
  },
  {
    "id": "A5xNIxA64OS",
    "name": "Kagenyi Dispensary",
    "code": "102159-1"
  },
  {
    "id": "xDV1fuzVvDq",
    "name": "Songambele Dispensary",
    "code": "107534-0"
  },
  {
    "id": "bBHcoqVXRlN",
    "name": "Kitwechenkura Dispensary",
    "code": "103206-9"
  },
  {
    "id": "dev6AHcQoNx",
    "name": "Kamuli Health Center",
    "code": "102298-7"
  },
  {
    "id": "NNgdM8UFgsU",
    "name": "Rugasha Dispensary",
    "code": "107133-1"
  },
  {
    "id": "cOGQKCAfwVt",
    "name": "St Thomas Dispensary",
    "code": "107636-3"
  },
  {
    "id": "tt1ywYC0HzD",
    "name": "Nyakabango Dispensary",
    "code": "109323-6"
  },
  {
    "id": "mJpQunoTNIX",
    "name": "Omurunazi Dispensary",
    "code": "106930-1"
  },
  {
    "id": "P1eE2Xvj7gq",
    "name": "Kishanda Dispensary",
    "code": "103097-2"
  },
  {
    "id": "j7L9Jw6Pj68",
    "name": "Burigi Dispensary",
    "code": "100011-6"
  },
  {
    "id": "Frc7g3FFpgQ",
    "name": "Rwantege Dispensary",
    "code": "107200-8"
  },
  {
    "id": "S9lrAOCcEFn",
    "name": "Kihwera Dispensary",
    "code": "102754-9"
  },
  {
    "id": "teNOzto3NFE",
    "name": "Buganguzi Dispensary",
    "code": "100440-7"
  },
  {
    "id": "sAn6N9zz4Y7",
    "name": "Ikuza Dispensary",
    "code": "110103-9"
  },
  {
    "id": "gZtObx0zhNR",
    "name": "Muyenje Dispensary",
    "code": "105743-9"
  },
  {
    "id": "Q626Lom5ki5",
    "name": "Kagoma Dispensary",
    "code": "102168-2"
  },
  {
    "id": "OrDLJvUmSZa",
    "name": "Menonite Dispensary",
    "code": "110034-6"
  },
  {
    "id": "FI0oAmOsQL6",
    "name": "Kitua Dispensary",
    "code": "103192-1"
  },
  {
    "id": "nefl1rBsmfh",
    "name": "Kibanga Dispensary",
    "code": "102574-1"
  },
  {
    "id": "n38R8IG2HtU",
    "name": "Karambi Dispensary",
    "code": "102370-4"
  },
  {
    "id": "oZQDl2751fN",
    "name": "Bushekya Dispensary",
    "code": "100599-0"
  },
  {
    "id": "jdTXxRTn519",
    "name": "Ilemera Dispensary",
    "code": "101735-9"
  },
  {
    "id": "cxDLztsGvdy",
    "name": "Kyota Dispensary",
    "code": "103438-8"
  },
  {
    "id": "HVjr01XFaZx",
    "name": "Ruhanga Dispensary",
    "code": "107137-2"
  },
  {
    "id": "Zs8GpLYscKN",
    "name": "Mubunda Dispensary",
    "code": "105616-7"
  },
  {
    "id": "wdtIeUkNQxd",
    "name": "Kyamyorwa Dispensary",
    "code": "103424-8"
  },
  {
    "id": "s5SFOZsPAEh",
    "name": "Kimwani Dispensary",
    "code": "102920-6"
  },
  {
    "id": "y4s1d2WiDH2",
    "name": "Kabare Dispensary",
    "code": "110261-5"
  },
  {
    "id": "mvWY40lACu2",
    "name": "Kaboya Dispensary",
    "code": "102143-5"
  },
  {
    "id": "lMWX0ay6QAF",
    "name": "Magereza Dispensary",
    "code": "111173-1"
  },
  {
    "id": "toSTIZX9Lr1",
    "name": "Kimeya Health Center",
    "code": "102910-7"
  },
  {
    "id": "INxe1diZtmQ",
    "name": "Kishuro Dispensary",
    "code": "103106-1"
  },
  {
    "id": "USWQVtXBB1S",
    "name": "Rushwa Dispensary",
    "code": "107172-9"
  },
  {
    "id": "a4IAD80ExmE",
    "name": "Izigo Health Center",
    "code": "102051-0"
  },
  {
    "id": "PggzvjzQXP4",
    "name": "Katoke Dispensary",
    "code": "102479-3"
  },
  {
    "id": "KVxA4hrPkq2",
    "name": "Kaigara Health Center",
    "code": "102192-2"
  },
  {
    "id": "uqLhl1MIpvw",
    "name": "Nshamba Health Center",
    "code": "106577-0"
  },
  {
    "id": "ad1FovBDXLw",
    "name": "Mazinga Dispensary",
    "code": "104531-9"
  },
  {
    "id": "kgTr9Sm3J9D",
    "name": "Kyebitembe Dispensary",
    "code": "103428-9"
  },
  {
    "id": "uVBhgTmVMoo",
    "name": "Kerebe Dispensary",
    "code": "102544-4"
  },
  {
    "id": "KTLAnZad6Xc",
    "name": "Kamachumu Health Center",
    "code": "102270-6"
  },
  {
    "id": "GnJRHIqAhrh",
    "name": "Rugando Dispensary",
    "code": "107130-7"
  },
  {
    "id": "LWM2R5r8fN9",
    "name": "Bisheke Dispensary",
    "code": "109040-6"
  },
  {
    "id": "mwQzvi2gEFp",
    "name": "Bumbire Dispensary",
    "code": "109071-1"
  },
  {
    "id": "Bhkn0IjmgEn",
    "name": "Madalena Kolping Dispensary",
    "code": "111170-7"
  },
  {
    "id": "In5SdHAd61o",
    "name": "Kabale B Dispensary",
    "code": "110087-4"
  },
  {
    "id": "NtZ7pkmsqRJ",
    "name": "Huruma Dispensary",
    "code": "111174-9"
  },
  {
    "id": "IjX1cHKDKTL",
    "name": "Rwigembe Dispensary",
    "code": "107205-7"
  },
  {
    "id": "HWVq70wuL7Q",
    "name": "Hindu Union Dispensary",
    "code": "101371-3"
  },
  {
    "id": "V8ura72EbyS",
    "name": "Buyekera Police Line Dispensary",
    "code": "100630-3"
  },
  {
    "id": "d7SDjoOrfMX",
    "name": "COSAD Dispensary",
    "code": "111166-5"
  },
  {
    "id": "gibytp0wd1g",
    "name": "Rugambwa Dispensary",
    "code": "107129-9"
  },
  {
    "id": "iZtMdZXYhEu",
    "name": "Magereza Dispensary",
    "code": "103927-0"
  },
  {
    "id": "dOaCBd55Xdh",
    "name": "Buhembe Dispensary",
    "code": "100474-6"
  },
  {
    "id": "MODoeJSfh52",
    "name": "Prinmat Ekisha Maternity Clinic",
    "code": "108905-1"
  },
  {
    "id": "cZziunIGZ1a",
    "name": "Bukoba Town Health Center",
    "code": "108903-6"
  },
  {
    "id": "YUPHGKVyAVX",
    "name": "Kagemu Dispensary",
    "code": "102158-3"
  },
  {
    "id": "Cnff2b5tpIF",
    "name": "FFU Nshambya Dispensary",
    "code": "106578-8"
  },
  {
    "id": "v4cLUrncYcC",
    "name": "Ijuganyondo Dispensary",
    "code": "101636-9"
  },
  {
    "id": "owKGUwhQmPo",
    "name": "KJ 21 Dispensary",
    "code": "103262-2"
  },
  {
    "id": "KYLtog49MXj",
    "name": "Zamzam Health Center",
    "code": "108406-0"
  },
  {
    "id": "EExKon9BK0p",
    "name": "Nshambya Dispensary",
    "code": "111167-3"
  },
  {
    "id": "bMfY0cPi6NP",
    "name": "Kashai Dispensary",
    "code": "102424-9"
  },
  {
    "id": "Q3fhMRzvZk3",
    "name": "Karibu Dispensary",
    "code": "102384-5"
  },
  {
    "id": "mkNtmUOEoaZ",
    "name": "TANICA Dispensary",
    "code": "107758-5"
  },
  {
    "id": "wof79mdsxq5",
    "name": "Mugeza Mseto Dispensary",
    "code": "105630-8"
  },
  {
    "id": "qNkYUIyHrp1",
    "name": "Kahororo Dispensary",
    "code": "102186-4"
  },
  {
    "id": "lweCW5H82tc",
    "name": "Rwamishenye Health Center",
    "code": "107193-5"
  },
  {
    "id": "WHd3e4N6Z12",
    "name": "St John Dispensary",
    "code": "111871-0"
  },
  {
    "id": "cIljI5PWq90",
    "name": "Ufufuo Health Center",
    "code": "110959-4"
  },
  {
    "id": "FCuyWLhmHRV",
    "name": "St Theresian Health Center",
    "code": "107634-8"
  },
  {
    "id": "BLbG3Qs8FrB",
    "name": "Kihinga Dispensary",
    "code": "102743-2"
  },
  {
    "id": "ciFeIdYyYda",
    "name": "K9 JWTZ Dispensary",
    "code": "108552-1"
  },
  {
    "id": "QIlUqQNuiky",
    "name": "Ntobeye Dispensary",
    "code": "106605-9"
  },
  {
    "id": "Zs5Kl4DTQE4",
    "name": "Ibuga Dispensary",
    "code": "111171-5"
  },
  {
    "id": "lq03OnwFd4P",
    "name": "Kasulo Dispensary",
    "code": "102452-0"
  },
  {
    "id": "aJHp11fXDuu",
    "name": "Rwimbogo Dispensary",
    "code": "107206-5"
  },
  {
    "id": "YRTPylKdXjK",
    "name": "Huduma Dispensary",
    "code": "108550-5"
  },
  {
    "id": "PUE9mDRroCg",
    "name": "Ruganzo Dispensary",
    "code": "107131-5"
  },
  {
    "id": "yyr1idxJyoX",
    "name": "Nterungwe Dispensary",
    "code": "106603-4"
  },
  {
    "id": "wT7Q7xajqfm",
    "name": "Nyamahwa Dispensary",
    "code": "106692-7"
  },
  {
    "id": "lb0zjX98Yom",
    "name": "Nyarulama Dispensary",
    "code": "106682-8"
  },
  {
    "id": "sfbJ3yY3fe5",
    "name": "Kanyinya Dispensary",
    "code": "102348-0"
  },
  {
    "id": "bFdvNRoxTJM",
    "name": "Muyenzi Dispensary",
    "code": "105744-7"
  },
  {
    "id": "v1MHZXR8VDF",
    "name": "Munjebwe Dispensary",
    "code": "105694-4"
  },
  {
    "id": "BdgijHr2unO",
    "name": "Nyakisasa Dispensary",
    "code": "106678-6"
  },
  {
    "id": "tPataSDsral",
    "name": "Magereza Rusumo Dispensary",
    "code": "107177-8"
  },
  {
    "id": "cQCSElXKCiw",
    "name": "Mukubu Dispensary",
    "code": "105668-8"
  },
  {
    "id": "tKKQBT10ew8",
    "name": "Mumhamba Dispensary",
    "code": "105682-9"
  },
  {
    "id": "q7FFMd0nMXS",
    "name": "Katerere Dispensary",
    "code": "102472-8"
  },
  {
    "id": "E8nGuUS7ppB",
    "name": "Djuruligwa Dispensary",
    "code": "100986-9"
  },
  {
    "id": "T688XWmWu8p",
    "name": "Tumaini Health Center",
    "code": "107925-0"
  },
  {
    "id": "fYWCWcdp22w",
    "name": "Mukatabo Dispensary",
    "code": "105665-4"
  },
  {
    "id": "mkfzwTJ9rAX",
    "name": "Rusumo Dispensary",
    "code": "107176-0"
  },
  {
    "id": "ycF6HnBIL61",
    "name": "Mshikamano Dispensary",
    "code": "105458-4"
  },
  {
    "id": "unOA5b9PfEC",
    "name": "Magamba Dispensary",
    "code": "103896-7"
  },
  {
    "id": "qYS7k7ckgMr",
    "name": "Lourdes Dispensary",
    "code": "103586-4"
  },
  {
    "id": "I4wQZ37mI8o",
    "name": "Buhororo Dispensary",
    "code": "100483-7"
  },
  {
    "id": "acCpldWnVJK",
    "name": "Mabawe Health Center",
    "code": "103817-3"
  },
  {
    "id": "uq8WtzZ74Q6",
    "name": "Magereza Ngara Dispensary",
    "code": "106350-2"
  },
  {
    "id": "KfXvHwdqCWV",
    "name": "Kabalenzi Dispensary",
    "code": "102128-6"
  },
  {
    "id": "uolYtmMB3gj",
    "name": "Shanga Dispensary",
    "code": "107395-6"
  },
  {
    "id": "KvGRXU1WDZR",
    "name": "Murusagamba Health Center",
    "code": "105710-8"
  },
  {
    "id": "z2fFIwNYitH",
    "name": "Muganza Dispensary",
    "code": "105626-6"
  },
  {
    "id": "UcSfOt89122",
    "name": "Mayenzi Dispensary",
    "code": "104519-4"
  },
  {
    "id": "t35CQaOl9MQ",
    "name": "Burengo Dispensary",
    "code": "102471-0"
  },
  {
    "id": "bqoom6EmsJ8",
    "name": "Bugarama Dispensary",
    "code": "109761-7"
  },
  {
    "id": "s2HGkHrCQX4",
    "name": "Mumilamila Dispensary",
    "code": "105681-1"
  },
  {
    "id": "hcnQ0cTafpM",
    "name": "Lukole Health Center",
    "code": "103692-0"
  },
  {
    "id": "m73FO6iXekc",
    "name": "Ntanga Dispensary",
    "code": "106596-0"
  },
  {
    "id": "OL1L6f3UEXl",
    "name": "Keza Dispensary",
    "code": "102549-3"
  },
  {
    "id": "kRhS0oZmOT2",
    "name": "Chivu Dispensary",
    "code": "100860-6"
  },
  {
    "id": "N0aoGZBcJa2",
    "name": "Kumtana Dispensary",
    "code": "111265-5"
  },
  {
    "id": "zrxiWO17pfm",
    "name": "Kabanga Private Dispensary",
    "code": "102133-6"
  },
  {
    "id": "GNQO92bcfLI",
    "name": "Amen Dispensary",
    "code": "111681-3"
  },
  {
    "id": "lKNas98QWeU",
    "name": "Kanazi Dispensary",
    "code": "102304-3"
  },
  {
    "id": "qcvJy47qw02",
    "name": "Kazingati Dispensary",
    "code": "102521-2"
  },
  {
    "id": "hdTFlmyvcO6",
    "name": "Bukiriro Health Center",
    "code": "100504-0"
  },
  {
    "id": "HQBQt7vEb04",
    "name": "Kasharazi Dispensary",
    "code": "102426-4"
  },
  {
    "id": "CBb3QOuvB4P",
    "name": "Kirushya Dispensary",
    "code": "103055-0"
  },
  {
    "id": "wWbEv173xh6",
    "name": "Kasange Dispensary",
    "code": "102402-5"
  },
  {
    "id": "oQBuahkEERd",
    "name": "Kumugamba Dispensary",
    "code": "103333-1"
  },
  {
    "id": "wMNFfC3Nbz0",
    "name": "Mbuba Dispensary",
    "code": "104639-0"
  },
  {
    "id": "SqMbh4yCCOC",
    "name": "Kumubuga Dispensary",
    "code": "103332-3"
  },
  {
    "id": "QW25pHC4QL1",
    "name": "Murubanga Dispensary",
    "code": "105707-4"
  },
  {
    "id": "ydg5zQtuLqW",
    "name": "Kishoju Dispensary",
    "code": "103105-3"
  },
  {
    "id": "A7LhxQX31E0",
    "name": "Kiruruma Dispensary",
    "code": "103053-5"
  },
  {
    "id": "SFfSiak9XUb",
    "name": "Chamchuzi Dispensary",
    "code": "100719-4"
  },
  {
    "id": "ibRb572bHnv",
    "name": "Nyakabanga Dispensary",
    "code": "106651-3"
  },
  {
    "id": "aQhwrsbAmqx",
    "name": "Kigarama Dispensary",
    "code": "108931-7"
  },
  {
    "id": "xGeYmfugi6s",
    "name": "Nyaishozi Dispensary",
    "code": "106649-7"
  },
  {
    "id": "HjApg7en2CX",
    "name": "Karaseco Dispensary",
    "code": "102375-3"
  },
  {
    "id": "N1dEYcxqm54",
    "name": "Kayanga Prison Dispensary",
    "code": "102514-7"
  },
  {
    "id": "OwQXjG6IA6K",
    "name": "Kanoni Dispensary",
    "code": "108913-5"
  },
  {
    "id": "CbWdUbsnGm4",
    "name": "St. Longinus Dispensary",
    "code": "107605-8"
  },
  {
    "id": "WJMPqpmVof5",
    "name": "Bukangara Dispensary",
    "code": "100497-7"
  },
  {
    "id": "f60CcmKFdNO",
    "name": "Kibwera Dispensary",
    "code": "102638-4"
  },
  {
    "id": "PrLN7ZmzNc2",
    "name": "Rugu Dispensary",
    "code": "107135-6"
  },
  {
    "id": "jUxf1YgRAIH",
    "name": "Omurusimbi Dispensary",
    "code": "108917-6"
  },
  {
    "id": "cKp10FrCLZx",
    "name": "Buhamira Dispensary",
    "code": "100468-8"
  },
  {
    "id": "XewMRjwYZcw",
    "name": "Kayanga Health Center",
    "code": "102512-1"
  },
  {
    "id": "ZQ04I4JlSt4",
    "name": "Katwe Dispensary",
    "code": "102500-6"
  },
  {
    "id": "B5q9c44g27r",
    "name": "Kamagambo Dispensary",
    "code": "102271-4"
  },
  {
    "id": "DsCMQSjsCK3",
    "name": "Omukaliro Dispensary",
    "code": "102379-5"
  },
  {
    "id": "vPEyuOtGH9B",
    "name": "Chanika Dispensary",
    "code": "100739-2"
  },
  {
    "id": "yb38bzd3t2C",
    "name": "Ihembe Dispensary",
    "code": "101616-1"
  },
  {
    "id": "rjKY8oNSAd0",
    "name": "St. Michael Dispensary",
    "code": "107614-0"
  },
  {
    "id": "r82yhXMKyK2",
    "name": "Bujuruga Dispensary",
    "code": "100493-6"
  },
  {
    "id": "F16XarCwsA9",
    "name": "Nyakagoyagoye Dispensary",
    "code": "108924-2"
  },
  {
    "id": "tUuy0YOx9pa",
    "name": "Nyabiyonza Dispensary",
    "code": "106635-6"
  },
  {
    "id": "oGQa0nrFukE",
    "name": "Family Dispensary",
    "code": "109385-5"
  },
  {
    "id": "TTG2TpJkRkF",
    "name": "Kitengule Prison Dispensary",
    "code": "103172-3"
  },
  {
    "id": "Dwxt7g238Ds",
    "name": "Nyakahanga Hospital - Designated District Hospital",
    "code": "106656-2"
  },
  {
    "id": "NBRdW23KkpF",
    "name": "Kibogoizi Dispensary",
    "code": "109558-7"
  },
  {
    "id": "vQ6cwOlwLzy",
    "name": "Chonyonyo Dispensary",
    "code": "108995-2"
  },
  {
    "id": "VE1wF53YlE3",
    "name": "Kakiro Dispensary",
    "code": "102207-8"
  },
  {
    "id": "r9BEU3V5N3J",
    "name": "Eden Dispensary",
    "code": "109347-5"
  },
  {
    "id": "rKuAYDpua6Y",
    "name": "Nyakasimbi Dispensary",
    "code": "106663-8"
  },
  {
    "id": "qw5H85SV2oN",
    "name": "Kahanga Dispensary",
    "code": "108906-9"
  },
  {
    "id": "NSwWoGhBizt",
    "name": "Bisheshe Dispensary",
    "code": "109004-2"
  },
  {
    "id": "rn5aYJY9lf2",
    "name": "Kakuraijo Dispensary",
    "code": "102216-9"
  },
  {
    "id": "BqoFGl8JaWI",
    "name": "Kijumbura Dispensary",
    "code": "102766-3"
  },
  {
    "id": "WHsadZdHafR",
    "name": "Rwambaizi Health Center",
    "code": "107191-9"
  },
  {
    "id": "zn3Goifzm6e",
    "name": "Ruhita Dispensary",
    "code": "107140-6"
  },
  {
    "id": "Xp4ACzMAzmJ",
    "name": "Kanyigo Dispensary",
    "code": "102346-4"
  },
  {
    "id": "MMwulModhx5",
    "name": "Kyelima Dispensary",
    "code": "103431-3"
  },
  {
    "id": "MBCNNEiTsKJ",
    "name": "Kashenye Dispensary",
    "code": "102431-4"
  },
  {
    "id": "uakAJMGly6E",
    "name": "Kikukwe Dispensary",
    "code": "102794-5"
  },
  {
    "id": "C7rKdZ1vj5c",
    "name": "Bukwali Dispensary",
    "code": "100522-2"
  },
  {
    "id": "gUZmfIljYg1",
    "name": "Kigarama Dispensary",
    "code": "102700-2"
  },
  {
    "id": "C3QfZJDp0Qg",
    "name": "Byeju Dispensary",
    "code": "100666-7"
  },
  {
    "id": "uf4e773MDK6",
    "name": "Lukuba Dispensary",
    "code": "107151-3"
  },
  {
    "id": "qzJX1FM65mA",
    "name": "Kashanga Dispensary",
    "code": "102425-6"
  },
  {
    "id": "YKEOpUl1LTm",
    "name": "Buyango Dispensary",
    "code": "100629-5"
  },
  {
    "id": "xU3BgO3H7US",
    "name": "Mwemage Dispensary",
    "code": "110161-7"
  },
  {
    "id": "IApO1XF8Lea",
    "name": "Bugango Dispensary",
    "code": "100439-9"
  },
  {
    "id": "dDs5BpnWEVG",
    "name": "Igayaza Dispensary",
    "code": "101537-9"
  },
  {
    "id": "IFpDRBQ8jLi",
    "name": "Kitobo Dispensary",
    "code": "103184-8"
  },
  {
    "id": "opr3vIHjnac",
    "name": "Kashasha Dispensary",
    "code": "102428-0"
  },
  {
    "id": "GcOkgIRHtWT",
    "name": "Minziro Dispensary",
    "code": "104953-5"
  },
  {
    "id": "euHDUsEQ8Ol",
    "name": "Kakindo Dispensary",
    "code": "102205-2"
  },
  {
    "id": "hbGid0a4SQR",
    "name": "Kilimilile Dispensary",
    "code": "102850-5"
  },
  {
    "id": "Pg9xHPOk62M",
    "name": "Mutukula Dispensary",
    "code": "105725-6"
  },
  {
    "id": "X77vex63BBF",
    "name": "Gera Dispensary",
    "code": "101200-4"
  },
  {
    "id": "mlpgQ6rCHyx",
    "name": "Bugandika Dispensary",
    "code": "100436-5"
  },
  {
    "id": "oACCObwlpve",
    "name": "Kyaka Dispensary",
    "code": "103421-4"
  },
  {
    "id": "fh4FrrGokIh",
    "name": "Buchurago Dispensary",
    "code": "110207-8"
  },
  {
    "id": "HBRgvVdx5YA",
    "name": "Kagera Salient In Dispensary",
    "code": "109969-6"
  },
  {
    "id": "S7FRf1F5joB",
    "name": "Tweyambe Dispensary",
    "code": "109921-7"
  },
  {
    "id": "C6wniYJFG2d",
    "name": "Nyankere Dispensary",
    "code": "106782-6"
  },
  {
    "id": "AZu51PqLcPu",
    "name": "Kabyaile Health Centre",
    "code": "111826-4"
  },
  {
    "id": "Q8QnhZlaztk",
    "name": "Kakunyu Dispensary",
    "code": "110219-3"
  },
  {
    "id": "GLHWU3hbMaN",
    "name": "Bugorora Dispensary",
    "code": "100458-9"
  },
  {
    "id": "DslhH0ysI4c",
    "name": "Ishozi Dispensary",
    "code": "101911-6"
  },
  {
    "id": "gIKHmIt8py5",
    "name": "Bubale Dispensary",
    "code": "100421-7"
  },
  {
    "id": "temZHvahDcJ",
    "name": "Bunazi Health Center",
    "code": "100564-4"
  },
  {
    "id": "qDSbwhObqj5",
    "name": "Ruzinga Dispensary",
    "code": "107189-3"
  },
  {
    "id": "Ry4uga5o9GN",
    "name": "Bulembo Dispensary",
    "code": "100534-7"
  },
  {
    "id": "thgUKqFruPa",
    "name": "Samvura Dispensary",
    "code": "107271-9"
  },
  {
    "id": "rd6xPExvDoO",
    "name": "Nyamisivyi Dispensary",
    "code": "106737-0"
  },
  {
    "id": "aI2MEFrU3SA",
    "name": "Kumkugwa Dispensary",
    "code": "103329-9"
  },
  {
    "id": "nCk7t4X4Eky",
    "name": "Kigina Dispensary",
    "code": "102709-3"
  },
  {
    "id": "bOXgpe73Y6w",
    "name": "Kitahana Dispensary",
    "code": "103145-9"
  },
  {
    "id": "jmZGu9n9m8H",
    "name": "Nyarugusu Dispensary",
    "code": "106808-9"
  },
  {
    "id": "bmmxYIH6AVG",
    "name": "Kigaga Dispensary",
    "code": "102690-5"
  },
  {
    "id": "pfn1csqD1Ri",
    "name": "Kibuye Dispensary",
    "code": "102632-7"
  },
  {
    "id": "xnehJRpU9tX",
    "name": "Kisogwe Dispensary",
    "code": "103128-5"
  },
  {
    "id": "GkBL1VasHDh",
    "name": "Biturana Dispensary",
    "code": "100382-1"
  },
  {
    "id": "YbodYDuxZTr",
    "name": "Nengo Dispensary",
    "code": "106305-6"
  },
  {
    "id": "JakGv2BctEX",
    "name": "Kibingo Dispensary",
    "code": "102604-6"
  },
  {
    "id": "CQdU5oPykDm",
    "name": "Rusohoko Dispensary",
    "code": "107174-5"
  },
  {
    "id": "zhEaRV5K4xM",
    "name": "Kigendeka Dispensary",
    "code": "102702-8"
  },
  {
    "id": "wlr6g9shvtu",
    "name": "Itaba Dispensary",
    "code": "101947-0"
  },
  {
    "id": "qAQHXGaQB7S",
    "name": "Nabuhima Dispensary",
    "code": "106060-7"
  },
  {
    "id": "nQd5N2ELgSE",
    "name": "Busunzu Dispensary",
    "code": "100616-2"
  },
  {
    "id": "GECsC9HM7Q6",
    "name": "Bitare Dispensary",
    "code": "100378-9"
  },
  {
    "id": "tEBGLnrCfwk",
    "name": "Kasaka Dispensary",
    "code": "102392-8"
  },
  {
    "id": "Ed2oFJFY7Jk",
    "name": "Kumuhama Dispensary",
    "code": "103334-9"
  },
  {
    "id": "uwKnDIQqUzM",
    "name": "Kumsenga Dispensary",
    "code": "103330-7"
  },
  {
    "id": "iC8CKtq9V3Y",
    "name": "Nyakasanda Dispensary",
    "code": "106662-0"
  },
  {
    "id": "OmqHYhNDN20",
    "name": "Mabamba Health Center",
    "code": "103815-7"
  },
  {
    "id": "nWYlh0TZ32V",
    "name": "Mukabuye Dispensary",
    "code": "105662-1"
  },
  {
    "id": "U9ZjN3ACMTb",
    "name": "Rugunga Dispensary",
    "code": "107136-4"
  },
  {
    "id": "VA8Q4c5HpII",
    "name": "Bakwata Dispensary",
    "code": "100240-1"
  },
  {
    "id": "yknCt2iJa8e",
    "name": "Mikonko Dispensary",
    "code": "110182-3"
  },
  {
    "id": "P2qSwfwlbe7",
    "name": "Kigogo Dispensary",
    "code": "102711-9"
  },
  {
    "id": "aBJnf8GzMrK",
    "name": "Kumubanga Dispensary",
    "code": "103331-5"
  },
  {
    "id": "cVXpwkMtSrt",
    "name": "Kifura Health Center",
    "code": "102687-1"
  },
  {
    "id": "TuIzmZMVKYL",
    "name": "Kichananga Dispensary",
    "code": "102641-8"
  },
  {
    "id": "IgPK77pchlR",
    "name": "Kibondo Hospital",
    "code": "102618-6"
  },
  {
    "id": "vbCC77rPrM6",
    "name": "Kumhasha Dispensary",
    "code": "103335-6"
  },
  {
    "id": "PTGzRdVNRWQ",
    "name": "Kibondo Dispensary",
    "code": "109191-7"
  },
  {
    "id": "utVSEw8gZsh",
    "name": "NDUTA Health Center",
    "code": "111785-2"
  },
  {
    "id": "yJ8o8gd3g0t",
    "name": "Twabagondozi Dispensary",
    "code": "107963-1"
  },
  {
    "id": "Oo3UQ5ZAJgM",
    "name": "Nyange Dispensary",
    "code": "106766-9"
  },
  {
    "id": "UYXfHi6kYk2",
    "name": "Magarama Dispensary",
    "code": "110190-6"
  },
  {
    "id": "o43lVTNx46v",
    "name": "Bunyambo Dispensary",
    "code": "100578-4"
  },
  {
    "id": "YjcXHjdW46W",
    "name": "Nyabitaka Dispensary",
    "code": "106634-9"
  },
  {
    "id": "rouJoSDR63H",
    "name": "Nyaruyoba Dispensary",
    "code": "106812-1"
  },
  {
    "id": "OTHLHRyQtLj",
    "name": "Nyarugunga Dispensary",
    "code": "106805-5"
  },
  {
    "id": "c5BvJOCrwW6",
    "name": "Mukarazi Dispensary",
    "code": "105663-9"
  },
  {
    "id": "mSFbs4r8Rvu",
    "name": "Minyinya Dispensary",
    "code": "104951-9"
  },
  {
    "id": "ED9IGpqNumy",
    "name": "Chankambwimba Dispensary",
    "code": "100744-2"
  },
  {
    "id": "ttn6qUq5FYj",
    "name": "Nyamhoza Dispensary",
    "code": "106719-8"
  },
  {
    "id": "QP3WXezEe8l",
    "name": "Kwitanga Prison Dispensary",
    "code": "103419-8"
  },
  {
    "id": "l2Phw5Rg4Jk",
    "name": "Nkungwe Dispensary",
    "code": "106550-7"
  },
  {
    "id": "yzKMzDLEcsx",
    "name": "Mwamgongo Health Center",
    "code": "105882-5"
  },
  {
    "id": "RZcHVth4QTM",
    "name": "Mwandiga Dispensary",
    "code": "105910-4"
  },
  {
    "id": "keiT8QrIKqQ",
    "name": "Zashe Dispensary",
    "code": "108409-4"
  },
  {
    "id": "RAXGbK2VR13",
    "name": "Bugamba Dispensary",
    "code": "100435-7"
  },
  {
    "id": "Jor52y6FnnJ",
    "name": "Kizenga Dispensary",
    "code": "103243-2"
  },
  {
    "id": "tsEt9ksI8dn",
    "name": "Nyarubanda Dispensary",
    "code": "106802-2"
  },
  {
    "id": "ENw6VyQ4Ixh",
    "name": "Matyazo Health Center",
    "code": "104492-4"
  },
  {
    "id": "YgjXpAq7kuu",
    "name": "Gombe National Park Dispensary",
    "code": "101238-4"
  },
  {
    "id": "DcUHjQQdbtt",
    "name": "Mukigo Dispensary",
    "code": "105067-3"
  },
  {
    "id": "eOfLYYRUVlV",
    "name": "Kalalangabo Dispensary",
    "code": "110150-0"
  },
  {
    "id": "ASu6HwlX35o",
    "name": "Kagongo Dispensary",
    "code": "110148-4"
  },
  {
    "id": "mLkRmBIPDXt",
    "name": "Msimba Dispensary",
    "code": "105467-5"
  },
  {
    "id": "mohQ9t1jP91",
    "name": "Kaseke Dispensary",
    "code": "102408-2"
  },
  {
    "id": "TppAFm1TM6Y",
    "name": "Mahembe Dispensary",
    "code": "104016-1"
  },
  {
    "id": "l1jKf5Yieo4",
    "name": "Bubango Dispensary",
    "code": "100423-3"
  },
  {
    "id": "AgXHo5WjD2p",
    "name": "Kidahwe Dispensary",
    "code": "102654-1"
  },
  {
    "id": "dbwWLnnaNs4",
    "name": "Kiganza Government Dispensary",
    "code": "110143-5"
  },
  {
    "id": "ZUGXLToB0Q4",
    "name": "Kasuku Dispensary",
    "code": "102451-2"
  },
  {
    "id": "yuBYZhDJx4c",
    "name": "Simbo Dispensary",
    "code": "107476-4"
  },
  {
    "id": "w8R3tBIQ4ty",
    "name": "Kamara Dispensary",
    "code": "102274-8"
  },
  {
    "id": "zf0TnlrdGHy",
    "name": "Kalinzi Dispensary",
    "code": "102248-2"
  },
  {
    "id": "sNakCXjs86U",
    "name": "Kigalye Dispensary",
    "code": "102692-1"
  },
  {
    "id": "up22jGeCuRv",
    "name": "Nyamoli Dispensary",
    "code": "106742-0"
  },
  {
    "id": "dmEMaqKVNh1",
    "name": "Mgaraganza Dispensary",
    "code": "104772-9"
  },
  {
    "id": "Jz3ub17hElK",
    "name": "Kiziba Dispensary",
    "code": "103247-3"
  },
  {
    "id": "lwOzq0zqzQa",
    "name": "Kasaka Health Center",
    "code": "110146-8"
  },
  {
    "id": "lJfCAqJxMhl",
    "name": "Mkabogo Dispensary",
    "code": "105034-3"
  },
  {
    "id": "uZvOXBydzUt",
    "name": "Tumaini Dispensary",
    "code": "107922-7"
  },
  {
    "id": "vh2uQoRQijG",
    "name": "Mtanga Dispensary",
    "code": "105535-9"
  },
  {
    "id": "zhMUatpoC08",
    "name": "Chankele Dispensary",
    "code": "100745-9"
  },
  {
    "id": "TqK4dGdmEtg",
    "name": "Matendo Dispensary",
    "code": "104459-3"
  },
  {
    "id": "Fv2Uix2ZeUP",
    "name": "Bitale Health Center",
    "code": "100377-1"
  },
  {
    "id": "AxMKRT36gQw",
    "name": "Bigabiro Dispensary",
    "code": "100359-9"
  },
  {
    "id": "O3IC8Bi1RsF",
    "name": "Bulombora Dispensary",
    "code": "100542-0"
  },
  {
    "id": "pzqyONMZwLe",
    "name": "Kagunga Dispensary",
    "code": "102175-7"
  },
  {
    "id": "Sj6Tfth8LH1",
    "name": "Mkongoro Dispensary",
    "code": "105106-9"
  },
  {
    "id": "OLhGTMBLcJD",
    "name": "Pamila Dispensary",
    "code": "106955-8"
  },
  {
    "id": "YrAeMPh7Lu8",
    "name": "Furaha Dispensary",
    "code": "101163-4"
  },
  {
    "id": "d22Fw9ALrgL",
    "name": "Ujiji Health Center",
    "code": "108046-4"
  },
  {
    "id": "wu2M0MjKNr6",
    "name": "Victory Eye care clinic",
    "code": "111565-8"
  },
  {
    "id": "hCDRjHC9o4R",
    "name": "24 KJ Dispensary",
    "code": "110967-7"
  },
  {
    "id": "SPzlPoMgwfc",
    "name": "Mac-Ren Medical clinic",
    "code": "111564-1"
  },
  {
    "id": "WToiqugZvkS",
    "name": "Rusimbi Dispensary",
    "code": "107173-7"
  },
  {
    "id": "nh2BEO8QU1F",
    "name": "Kasulwa Dispensary",
    "code": "108710-5"
  },
  {
    "id": "sauYYtSjFX6",
    "name": "Bangwe Road Dispensary",
    "code": "111830-6"
  },
  {
    "id": "GdkVEpY2SVV",
    "name": "Gungu Health Center",
    "code": "101270-7"
  },
  {
    "id": "TTsajZYVJBK",
    "name": "Mzidalfa Dispensary",
    "code": "105758-7"
  },
  {
    "id": "T2FAVPuANPy",
    "name": "Msufini Dispensary",
    "code": "105503-7"
  },
  {
    "id": "tLgae31XwXc",
    "name": "Jibu Lenu Dispensary",
    "code": "102082-5"
  },
  {
    "id": "pCJX9uY9AnS",
    "name": "Magereza Dispensary",
    "code": "110136-9"
  },
  {
    "id": "zaSVvUUJncU",
    "name": "SDA Dispensary",
    "code": "107329-5"
  },
  {
    "id": "RHKTZSscC8B",
    "name": "Kigoma Dispensary",
    "code": "110120-3"
  },
  {
    "id": "wUAa9F6iGV9",
    "name": "Businde Dispensary",
    "code": "100605-5"
  },
  {
    "id": "VZsfl0ww7G7",
    "name": "Huruma Dispensary",
    "code": "108730-3"
  },
  {
    "id": "oWCgz3LcP69",
    "name": "Buhanda Dispensary",
    "code": "100469-6"
  },
  {
    "id": "XYW3CYlwEsy",
    "name": "Upendo Dispensary",
    "code": "108121-5"
  },
  {
    "id": "qsbgsxnYdPJ",
    "name": "International Health Center",
    "code": "102718-4"
  },
  {
    "id": "VFKCyAqGpBQ",
    "name": "TRL Dispensary",
    "code": "107881-5"
  },
  {
    "id": "Fa4mlQFc6M9",
    "name": "Kitambuka Dispensary",
    "code": "103152-5"
  },
  {
    "id": "NNHEvkinVTB",
    "name": "Kinazi Dispensary",
    "code": "102933-9"
  },
  {
    "id": "gZTX335Ao7D",
    "name": "Nyakimue Dispensary",
    "code": "106675-2"
  },
  {
    "id": "YlSncZ2V0F6",
    "name": "Katundu Dispensary",
    "code": "102495-9"
  },
  {
    "id": "h9WWOsuzuNe",
    "name": "Kigogwe Dispensary",
    "code": "102715-0"
  },
  {
    "id": "BSyRnPLpcQB",
    "name": "Munanila Dispensary",
    "code": "105237-2"
  },
  {
    "id": "tCfEKvWREek",
    "name": "Kilelema Dispensary",
    "code": "102821-6"
  },
  {
    "id": "KjLn4F0ljfR",
    "name": "Mubanga Dispensary",
    "code": "105615-9"
  },
  {
    "id": "BP3zq0c9YjC",
    "name": "Migongo Dispensary",
    "code": "104877-6"
  },
  {
    "id": "TRJkFmYRrlr",
    "name": "Kirungu Dispensary",
    "code": "103050-1"
  },
  {
    "id": "fo45CWEFGWR",
    "name": "Biharu Health Center",
    "code": "100362-3"
  },
  {
    "id": "yuVC7eZcDDe",
    "name": "Kibande Dispensary",
    "code": "102573-3"
  },
  {
    "id": "vS0IAT52K2x",
    "name": "Mugera Dispensary",
    "code": "110232-6"
  },
  {
    "id": "xp55itnbypV",
    "name": "Mulera Health Center",
    "code": "105677-9"
  },
  {
    "id": "lanNXSCG3sZ",
    "name": "Mwayaya Dispensary",
    "code": "105985-6"
  },
  {
    "id": "ikHJb63LOl3",
    "name": "Munzeze Dispensary",
    "code": "108759-2"
  },
  {
    "id": "tL108p699o2",
    "name": "Muhinda Dispensary",
    "code": "105652-2"
  },
  {
    "id": "I5n7ciffQpK",
    "name": "Kibwigwa Dispensary",
    "code": "102640-0"
  },
  {
    "id": "LXgNVfYF6mH",
    "name": "Buhigwe Dispensary",
    "code": "100475-3"
  },
  {
    "id": "OICXpPCfSTe",
    "name": "Kasumo Dispensary",
    "code": "102454-6"
  },
  {
    "id": "jPbrC3Gm4xk",
    "name": "Rusaba Dispensary",
    "code": "107169-5"
  },
  {
    "id": "iLfprTiJ4iE",
    "name": "Nyankoronko Dispensary",
    "code": "106784-2"
  },
  {
    "id": "jk6W2HWeCXb",
    "name": "Munyegera Dispensary",
    "code": "105696-9"
  },
  {
    "id": "K7q2IH7sULs",
    "name": "Songambele Dispensary",
    "code": "107538-1"
  },
  {
    "id": "x1uL0382y3N",
    "name": "Nyamabuye Dispensary",
    "code": "106686-9"
  },
  {
    "id": "NMgmPamd351",
    "name": "Janda Health Center",
    "code": "102074-2"
  },
  {
    "id": "aFmkOIlqg5R",
    "name": "Nyakafumbe Dispensary",
    "code": "111781-1"
  },
  {
    "id": "Z8efEILG628",
    "name": "Faraja Dispensary",
    "code": "111780-3"
  },
  {
    "id": "gCbGlJuzQ6i",
    "name": "Nyamgali Dispensary",
    "code": "106717-2"
  },
  {
    "id": "XGVVViiHN7V",
    "name": "Muyama Health Center",
    "code": "105742-1"
  },
  {
    "id": "tFq5ieyX217",
    "name": "Msagara Dispensary",
    "code": "105412-1"
  },
  {
    "id": "BG4ZqxMFtEU",
    "name": "Kajana Dispensary",
    "code": "102197-1"
  },
  {
    "id": "YYVWmkiuEoj",
    "name": "Nyaruboza Dispensary",
    "code": "106803-0"
  },
  {
    "id": "L28bosjDN9k",
    "name": "Shunga Health Center",
    "code": "107447-5"
  },
  {
    "id": "c9Ebdmqh9L9",
    "name": "Kigadye Dispensary",
    "code": "102689-7"
  },
  {
    "id": "jJZyiMACtlf",
    "name": "Nkundutsi Dispensary",
    "code": "106547-3"
  },
  {
    "id": "QfsB6Tmb2wC",
    "name": "Mwali Dispensary",
    "code": "105840-3"
  },
  {
    "id": "z2V6MZL61DL",
    "name": "Mtabila Dispensary",
    "code": "105516-9"
  },
  {
    "id": "wodejNGYmd5",
    "name": "Buhoro Dispensary",
    "code": "100482-9"
  },
  {
    "id": "Z5SDQRvrVgi",
    "name": "Titye Dispensary",
    "code": "107837-7"
  },
  {
    "id": "dPCnKreA4Cc",
    "name": "Nyakitonto Health Center",
    "code": "106680-2"
  },
  {
    "id": "L2DG8W8sBkt",
    "name": "Nyenge Health Center",
    "code": "106841-0"
  },
  {
    "id": "HdZ1YUdTgh4",
    "name": "Mvinza Dispensary",
    "code": "105766-0"
  },
  {
    "id": "Y3hDIfveNJi",
    "name": "Kitema Dispensary",
    "code": "103169-9"
  },
  {
    "id": "IPO7ftNAmUS",
    "name": "Kigembe Dispensary",
    "code": "102701-0"
  },
  {
    "id": "TwzTEy7UGU6",
    "name": "Nyarugusu Dispensary",
    "code": "110229-2"
  },
  {
    "id": "mvoUOKwYVb4",
    "name": "Heru Ushingo Dispensary",
    "code": "101359-8"
  },
  {
    "id": "OVrczlJuosp",
    "name": "Nyamnyusi Dispensary",
    "code": "108758-4"
  },
  {
    "id": "tOroOHwG8vC",
    "name": "Kitagata Dispensary",
    "code": "103142-6"
  },
  {
    "id": "SMcOcnM7oEf",
    "name": "Nyamidaho Dispensary",
    "code": "106721-4"
  },
  {
    "id": "rhkm38fF4Wd",
    "name": "Asante Nyerere Dispensary",
    "code": "100195-7"
  },
  {
    "id": "pY2dJhHABl0",
    "name": "Kagera Nkanda Dispensary",
    "code": "102163-3"
  },
  {
    "id": "B7AMKpDAto8",
    "name": "Mvugwe Dispensary",
    "code": "108748-5"
  },
  {
    "id": "D691Bz28UMw",
    "name": "Rungwe Mpya Dispensary",
    "code": "107164-6"
  },
  {
    "id": "bOMyGinRYMj",
    "name": "Kwaga Dispensary",
    "code": "103355-4"
  },
  {
    "id": "cL621ybKtKN",
    "name": "Nyarugusu Refugee Health Center",
    "code": "106809-7"
  },
  {
    "id": "Omn30AhxcXf",
    "name": "Kimwanya Health Center",
    "code": "108754-3"
  },
  {
    "id": "WBuE2eaVCQK",
    "name": "Kitanga Dispensary",
    "code": "103159-0"
  },
  {
    "id": "TEcC8e1Cl0m",
    "name": "Shunguliba Dispensary",
    "code": "107449-1"
  },
  {
    "id": "RTWDPyRGSEi",
    "name": "Muyovozi Health Center",
    "code": "105745-4"
  },
  {
    "id": "T6aqL6q5rlR",
    "name": "Muzye Dispensary",
    "code": "105763-7"
  },
  {
    "id": "RyH6HIwJqlT",
    "name": "Bugaga Dispensary",
    "code": "100434-0"
  },
  {
    "id": "x9UCm5ucCR3",
    "name": "Mugombe Dispensary",
    "code": "105636-5"
  },
  {
    "id": "SZWtPld8UZu",
    "name": "Zeze Dispensary",
    "code": "108414-4"
  },
  {
    "id": "keEFvXqCgLK",
    "name": "Kasangezi Dispensary",
    "code": "102403-3"
  },
  {
    "id": "Y7TVeHZYbYa",
    "name": "Rusesa Health Center",
    "code": "107170-3"
  },
  {
    "id": "mkKCAVwUPys",
    "name": "Mutala Dispensary",
    "code": "105724-9"
  },
  {
    "id": "BdbDMFT11Tk",
    "name": "Lalambe Dispensary",
    "code": "103454-5"
  },
  {
    "id": "wYRsjRAZChP",
    "name": "Makere Dispensary",
    "code": "104100-3"
  },
  {
    "id": "qeRUkUFWUA8",
    "name": "Nyachenda Dispensary",
    "code": "106644-8"
  },
  {
    "id": "GjvUIHnvW2t",
    "name": "Kaguruka Dispensary",
    "code": "102178-1"
  },
  {
    "id": "Gwx93Idy6DX",
    "name": "Kalela Dispensary",
    "code": "102232-6"
  },
  {
    "id": "mC3T2pLMWNF",
    "name": "Muhunga Dispensary",
    "code": "105660-5"
  },
  {
    "id": "EGNXux0zkdU",
    "name": "Mwanga Dispensary",
    "code": "105917-9"
  },
  {
    "id": "yVp26wThaT6",
    "name": "Mwibuye Dispensary",
    "code": "106014-4"
  },
  {
    "id": "BqRbht8zM9Z",
    "name": "Nyumbigwa Dispensary",
    "code": "106864-2"
  },
  {
    "id": "L9HqcmEAO5f",
    "name": "Kigondo Dispensary",
    "code": "102720-0"
  },
  {
    "id": "wVbxrzDBJyF",
    "name": "Heru Juu Dispensary",
    "code": "101358-0"
  },
  {
    "id": "SuDL9fciYgB",
    "name": "Ruhita Dispensary",
    "code": "107141-4"
  },
  {
    "id": "bct2iC6Mqa9",
    "name": "Muzdalifa Dispensary",
    "code": "105747-0"
  },
  {
    "id": "kCrGQpiunCw",
    "name": "Magereza Dispensary",
    "code": "108508-3"
  },
  {
    "id": "S2IQHqkjhue",
    "name": "Kanazi Dispensary",
    "code": "102302-7"
  },
  {
    "id": "UMGacBznEZW",
    "name": "Kabanga Mission Hospital",
    "code": "102132-8"
  },
  {
    "id": "ZSBTtjNGuyG",
    "name": "Marumba Psychiatric Unit Dispensary",
    "code": "109190-9"
  },
  {
    "id": "AKQ1EZseCM9",
    "name": "Huruma Dispensary",
    "code": "101409-1"
  },
  {
    "id": "FkivhzvPlwb",
    "name": "Murufiti Dispensary",
    "code": "105708-2"
  },
  {
    "id": "gJ1BWEDf3s1",
    "name": "Marumba Dispensary",
    "code": "104359-5"
  },
  {
    "id": "KLIichxpRer",
    "name": "Nyansha Life Cycle Dispensary",
    "code": "106786-7"
  },
  {
    "id": "hRRD8ReTB3V",
    "name": "Kidyama Dispensary",
    "code": "102673-1"
  },
  {
    "id": "ysQ9Lsty898",
    "name": "Kiganamo Health Center",
    "code": "102694-7"
  },
  {
    "id": "pPVz9ECPTn9",
    "name": "Msambara Dispensary",
    "code": "105425-3"
  },
  {
    "id": "gvcfetL1nMI",
    "name": "Kasulu District Hospital",
    "code": "102453-8"
  },
  {
    "id": "tsTig0O9gHg",
    "name": "Rumashi Dispensary",
    "code": "107154-7"
  },
  {
    "id": "oVVsekKN1dY",
    "name": "Nyagwijima Dispensary",
    "code": "106645-5"
  },
  {
    "id": "lFVRYMto7Bs",
    "name": "Kanyonza Dispensary",
    "code": "102349-8"
  },
  {
    "id": "Vk3PI6Xq2v3",
    "name": "Nyabibuye Dispensary",
    "code": "106631-5"
  },
  {
    "id": "z4gWl2KpvbV",
    "name": "Kiduduye Dispensary",
    "code": "102667-3"
  },
  {
    "id": "uRW97NpDO40",
    "name": "Upendo Dispensary",
    "code": "108130-6"
  },
  {
    "id": "XNymB5nTTap",
    "name": "Katanga Dispensary",
    "code": "102461-1"
  },
  {
    "id": "pMRWLsJcbge",
    "name": "Kanembwa Dispensary",
    "code": "102314-2"
  },
  {
    "id": "x423mOhVmSM",
    "name": "Gwarama Dispensary",
    "code": "101282-2"
  },
  {
    "id": "L5g78ZWuT9P",
    "name": "Mugunzu Dispensary",
    "code": "105640-7"
  },
  {
    "id": "PwNwi7KyALd",
    "name": "Kiga Dispensary",
    "code": "102688-9"
  },
  {
    "id": "KNnmS9tmJG6",
    "name": "Kasanda Dispensary",
    "code": "102396-9"
  },
  {
    "id": "RK9oXktqssG",
    "name": "Kasongati Dispensary",
    "code": "102445-4"
  },
  {
    "id": "ayarc7xKy8Q",
    "name": "Nyamtukuza Dispensary",
    "code": "106748-7"
  },
  {
    "id": "L5O9QCrzc8C",
    "name": "Kabare Dispensary",
    "code": "102125-2"
  },
  {
    "id": "OhN5suQo3zJ",
    "name": "Gwanumpu Health Center",
    "code": "101281-4"
  },
  {
    "id": "kRIWZHNEYT7",
    "name": "Kinonko Dispensary",
    "code": "102963-6"
  },
  {
    "id": "gwtdgLzpPYw",
    "name": "Kakonko Health Center",
    "code": "102211-0"
  },
  {
    "id": "eRqYvlv6tOv",
    "name": "Nyanzige Health Center",
    "code": "106797-4"
  },
  {
    "id": "h63KHYbDtKK",
    "name": "Nyakayenzi Dispensary",
    "code": "106673-7"
  },
  {
    "id": "aYy0v33Oqtb",
    "name": "Muhange Dispensary",
    "code": "105643-1"
  },
  {
    "id": "uWwF4odDDAq",
    "name": "Keza Dispensary",
    "code": "102548-5"
  },
  {
    "id": "cYQqbzJrsQ1",
    "name": "Kakonko Mission Dispensary",
    "code": "110849-7"
  },
  {
    "id": "eM2naiz9VLy",
    "name": "Kazilamihunda Dispensary",
    "code": "102519-6"
  },
  {
    "id": "FKIWcl40AJk",
    "name": "Kabingo Dispensary",
    "code": "102140-1"
  },
  {
    "id": "LJzeVs98cuV",
    "name": "Kasuga Dispensary",
    "code": "102449-6"
  },
  {
    "id": "Ge1oZCUahSk",
    "name": "Bukiliro Dispensary",
    "code": "108474-8"
  },
  {
    "id": "upuC98Ql0f6",
    "name": "Kyamajoje Dispensary",
    "code": "109395-4"
  },
  {
    "id": "OUCH7VaDexU",
    "name": "Kyawazarwe Dispensary",
    "code": "103427-1"
  },
  {
    "id": "DLiJ0sC7Ovb",
    "name": "Ryamisanga Dispensary",
    "code": "107208-1"
  },
  {
    "id": "C21E5N2TMo9",
    "name": "Butuguri Dispensary",
    "code": "100624-6"
  },
  {
    "id": "uQE1la1Zap0",
    "name": "Ryamugabo Dispensary",
    "code": "107207-3"
  },
  {
    "id": "CpwoANPtCn3",
    "name": "Giorgio Frassat RC Dispensary",
    "code": "102561-8"
  },
  {
    "id": "lGpc0H9SVrW",
    "name": "Busegwe Dispensary",
    "code": "100591-7"
  },
  {
    "id": "Rk9kacigtm9",
    "name": "Buruma Dispensary",
    "code": "100015-7"
  },
  {
    "id": "gGapitfOoVC",
    "name": "Nyankanga Dispensary",
    "code": "106781-8"
  },
  {
    "id": "zqC0VlEZz3t",
    "name": "Bisumwa Dispensary",
    "code": "100375-5"
  },
  {
    "id": "CJ4en7Df7eu",
    "name": "Rwamkoma Dispensary",
    "code": "107194-3"
  },
  {
    "id": "Py7l8bIvzxo",
    "name": "Buhemba Dispensary",
    "code": "100473-8"
  },
  {
    "id": "a8zLUlgJLl9",
    "name": "Kamugendi Dispensary",
    "code": "102290-4"
  },
  {
    "id": "C3Jrzz5sCzT",
    "name": "Bumangi Gvt Dispensary",
    "code": "100552-9"
  },
  {
    "id": "QiLFrSrCyTZ",
    "name": "Nyamika Dispensary",
    "code": "106725-5"
  },
  {
    "id": "JboCLMD7pQ3",
    "name": "Mirwa Dispensary",
    "code": "104968-3"
  },
  {
    "id": "dYh6AV3vtZj",
    "name": "Kizaru Dispensary",
    "code": "103242-4"
  },
  {
    "id": "ueFhaoklf7d",
    "name": "Baranga Dispensary",
    "code": "100325-0"
  },
  {
    "id": "wGjBq4E6YUa",
    "name": "Butiama Hospital",
    "code": "100619-6"
  },
  {
    "id": "S8Sx8x6ZRMJ",
    "name": "Rwamkoma JKT Dispensary",
    "code": "107195-0"
  },
  {
    "id": "udLdow49k7G",
    "name": "Nyamisis Dispensary",
    "code": "106736-2"
  },
  {
    "id": "fwCfaC4Wofu",
    "name": "Nyasirori Dispensary",
    "code": "106827-9"
  },
  {
    "id": "iaCic0hs44Q",
    "name": "Kamgegi Dispensary",
    "code": "102297-9"
  },
  {
    "id": "e0qfV6bYZVG",
    "name": "Rwasereta Dispensary",
    "code": "103163-2"
  },
  {
    "id": "FOkhaHYk1yt",
    "name": "Bumangi KMT Dispensary",
    "code": "100553-7"
  },
  {
    "id": "SG4b51Kr4Bv",
    "name": "Kiabakari Magereza Dispensary",
    "code": "102560-0"
  },
  {
    "id": "MOLq0ouf2GQ",
    "name": "Kiagata Health Center",
    "code": "102562-6"
  },
  {
    "id": "KOY6QxXRggd",
    "name": "Nyabange KMT Dispensary",
    "code": "106630-7"
  },
  {
    "id": "JKULF8a3QDl",
    "name": "Busegwe SDA Dispensary",
    "code": "100592-5"
  },
  {
    "id": "n5p1v5Ns5y3",
    "name": "Nyabange Govt Dispensary",
    "code": "106629-9"
  },
  {
    "id": "h9tFeLEzzFB",
    "name": "Mwanzaburiga Dispensary",
    "code": "105951-8"
  },
  {
    "id": "rIq6qHl3Um8",
    "name": "YASI Dispensary",
    "code": "111709-2"
  },
  {
    "id": "xDmRWXA9sMt",
    "name": "Mwibagi Dispensary",
    "code": "106013-6"
  },
  {
    "id": "woFa0IAovDc",
    "name": "Sirorisimba KMT Dispensary",
    "code": "107500-1"
  },
  {
    "id": "NzYamf3c43P",
    "name": "Magana Dispensary",
    "code": "103904-9"
  },
  {
    "id": "WtIynvPKpBm",
    "name": "Wegero Dispensary",
    "code": "108355-9"
  },
  {
    "id": "v6XT98crNxl",
    "name": "Masurura Dispensary",
    "code": "104430-4"
  },
  {
    "id": "z5vDmTgzwxY",
    "name": "Kiabakari JWTZ Dispensary",
    "code": "102559-2"
  },
  {
    "id": "Lfuzwf9Eq0F",
    "name": "Bulamba Dispensary",
    "code": "100526-3"
  },
  {
    "id": "OvQugW5tqOl",
    "name": "Salama A Dispensary",
    "code": "107245-3"
  },
  {
    "id": "N3dWqailzF0",
    "name": "Karukekere Dispensary",
    "code": "102387-8"
  },
  {
    "id": "if9jEeq1Y6Q",
    "name": "Kasahunga Health Center",
    "code": "102391-0"
  },
  {
    "id": "GQb8WwAWdJ7",
    "name": "Mwiruruma Dispensary",
    "code": "106025-0"
  },
  {
    "id": "iG52A1JWyvB",
    "name": "Kurusanga Dispensary",
    "code": "103344-8"
  },
  {
    "id": "Uwoy1s81aiF",
    "name": "Kisorya Health Center",
    "code": "103134-3"
  },
  {
    "id": "XKXh16wh600",
    "name": "Marambeka Dispensary",
    "code": "104311-6"
  },
  {
    "id": "UtQjA0SjISk",
    "name": "Salama Kati Dispensary",
    "code": "107246-1"
  },
  {
    "id": "yD5lIxodpbH",
    "name": "Nyaburundu Dispensary",
    "code": "106641-4"
  },
  {
    "id": "zYVHiJSv2jf",
    "name": "Iramba Dispensary",
    "code": "101847-2"
  },
  {
    "id": "jSGNfbncajp",
    "name": "Hunyari Dispensary",
    "code": "101404-2"
  },
  {
    "id": "BmZdCNtXC4x",
    "name": "Nafuba Dispensary",
    "code": "106067-2"
  },
  {
    "id": "M6jtlrOL3AG",
    "name": "Namhula Dispensary",
    "code": "106156-3"
  },
  {
    "id": "MUR7JinEMuK",
    "name": "Sunsi Dispensary",
    "code": "107678-5"
  },
  {
    "id": "hcs5LPw6mDH",
    "name": "Kasuguti Health Center",
    "code": "102450-4"
  },
  {
    "id": "snGTapVH0Hj",
    "name": "Igundu Dispensary",
    "code": "101587-4"
  },
  {
    "id": "BhgxujKDjwn",
    "name": "Mariwanda Dispensary",
    "code": "104350-4"
  },
  {
    "id": "v9Re6v0BDCU",
    "name": "Sarawe Dispensary",
    "code": "107302-2"
  },
  {
    "id": "Ua1pqfcN2Ul",
    "name": "Mugeta Health Center",
    "code": "105629-0"
  },
  {
    "id": "B2uoee0sTau",
    "name": "Bukama SDA Dispensary",
    "code": "100496-9"
  },
  {
    "id": "bQdXwM3f5MU",
    "name": "Manchimweru Dispensary",
    "code": "104217-5"
  },
  {
    "id": "D4qpxw5saNH",
    "name": "Shifra Maternity Home",
    "code": "111219-2"
  },
  {
    "id": "HvKwxqLKIoq",
    "name": "Busambara Dispensary",
    "code": "100583-4"
  },
  {
    "id": "C7TLkJdR8LF",
    "name": "Nyangere Dispensary",
    "code": "106767-7"
  },
  {
    "id": "pgfqVFbEFqs",
    "name": "Nansimo Dispensary",
    "code": "106190-2"
  },
  {
    "id": "O05z4ezdvTc",
    "name": "Ikizu Health Center",
    "code": "101652-6"
  },
  {
    "id": "X50ClBttAsN",
    "name": "Mekomariro Dispensary",
    "code": "104724-0"
  },
  {
    "id": "RHpUwtD4AvF",
    "name": "AICT Dispensary",
    "code": "100061-1"
  },
  {
    "id": "olQbmfkIcUd",
    "name": "Bhoke Dispensary",
    "code": "109869-8"
  },
  {
    "id": "gDfObSA6NZh",
    "name": "Faraja Primate Maternity Home",
    "code": "109457-2"
  },
  {
    "id": "l3fk4u8hkhy",
    "name": "Kabasa Dispensary",
    "code": "102137-7"
  },
  {
    "id": "HgWrlR4xNAS",
    "name": "Victory Dispensary",
    "code": "108245-2"
  },
  {
    "id": "xCcpIBfXDZE",
    "name": "Nyamatoke Dispensary",
    "code": "106704-0"
  },
  {
    "id": "yubgXeA7tk7",
    "name": "Kunzugu Dispensary",
    "code": "103340-6"
  },
  {
    "id": "oDWNAAep7H6",
    "name": "Mihale Dispensary",
    "code": "104886-7"
  },
  {
    "id": "caGonnhq66f",
    "name": "BOMA Dispensary",
    "code": "100393-8"
  },
  {
    "id": "ymn3g0srIZr",
    "name": "Nywatwali Health Center",
    "code": "109422-6"
  },
  {
    "id": "oNUbWvrebrZ",
    "name": "Mkono Dispensary",
    "code": "105109-3"
  },
  {
    "id": "VCcH68OcsAf",
    "name": "Wariku Dispensary",
    "code": "102325-8"
  },
  {
    "id": "XiitivAUm1d",
    "name": "Bunda Magereza Dispensary",
    "code": "109824-3"
  },
  {
    "id": "OZQvcHuKdvO",
    "name": "Sazira Dispensary",
    "code": "107321-2"
  },
  {
    "id": "Mz2VKCdWLLX",
    "name": "Bunda DDH Hospital",
    "code": "100566-9"
  },
  {
    "id": "NqLktbW2KoN",
    "name": "Manyamanyama Health Center",
    "code": "104277-9"
  },
  {
    "id": "DiZBnlQhJQQ",
    "name": "Guta Dispensary",
    "code": "101277-2"
  },
  {
    "id": "FIHxRxUmqtd",
    "name": "Ukombozi Dispensary",
    "code": "108055-5"
  },
  {
    "id": "aREgFrB77up",
    "name": "Mcharo Dispensary",
    "code": "104688-7"
  },
  {
    "id": "TWIxuEv8LM7",
    "name": "Kabale Maternity Home",
    "code": "109456-4"
  },
  {
    "id": "v26MrDMK1Zb",
    "name": "Tamau Dispensary",
    "code": "107723-9"
  },
  {
    "id": "CvFio02EtsH",
    "name": "Bunda Health Center",
    "code": "100565-1"
  },
  {
    "id": "kq3LUzsIYDY",
    "name": "Busungu Dispensary",
    "code": "100615-4"
  },
  {
    "id": "FpV41zDNhPR",
    "name": "Bugoji Dispensary",
    "code": "100457-1"
  },
  {
    "id": "icjchoXUjbU",
    "name": "Rwanga KMT Dispensary",
    "code": "107198-4"
  },
  {
    "id": "E3Y31TSTKws",
    "name": "Suguti Dispensary",
    "code": "107652-0"
  },
  {
    "id": "ffpz9TtfsyU",
    "name": "Masinono Dispensary",
    "code": "104413-0"
  },
  {
    "id": "u4p56fStLhe",
    "name": "Bukima Dispensary",
    "code": "100503-2"
  },
  {
    "id": "oNhc0vSutxg",
    "name": "Rukuba Dispensary",
    "code": "107152-1"
  },
  {
    "id": "ueefaDhtnhO",
    "name": "Bugunda Dispensary",
    "code": "100462-1"
  },
  {
    "id": "jrg03Wt4deU",
    "name": "Chitare Dispensary",
    "code": "100849-9"
  },
  {
    "id": "aSVw4jZpOfY",
    "name": "Etaro JW Dispensary",
    "code": "101113-9"
  },
  {
    "id": "O1w9ghhmh6a",
    "name": "Tegeruka Dispensary",
    "code": "107798-1"
  },
  {
    "id": "JuVktpsuypU",
    "name": "Mugango Dispensary",
    "code": "105624-1"
  },
  {
    "id": "wZctpAIaBli",
    "name": "Nyegina Dispensary",
    "code": "110894-3"
  },
  {
    "id": "rnxyo0mFSg0",
    "name": "Murangi Health Center",
    "code": "105700-9"
  },
  {
    "id": "cs4EKkXcu7D",
    "name": "Nyakatende Dispensary",
    "code": "106665-3"
  },
  {
    "id": "pAb4PwR7elB",
    "name": "Bwasi SDA Dispensary",
    "code": "100651-9"
  },
  {
    "id": "RYAtwW4EMlo",
    "name": "Seka Dispensary",
    "code": "107351-9"
  },
  {
    "id": "Od0N5TqZfOg",
    "name": "Etaro Dispensary",
    "code": "110887-7"
  },
  {
    "id": "kQsvdfwfKH6",
    "name": "Wanyere Dispensary",
    "code": "108315-3"
  },
  {
    "id": "LaUwul5tu0i",
    "name": "Rusoli Dispensary",
    "code": "107175-2"
  },
  {
    "id": "Q2vS9oyYjtr",
    "name": "Nyambono Dispensary",
    "code": "106711-5"
  },
  {
    "id": "y9Kfr5Ie1dv",
    "name": "Kiriba Dispensary",
    "code": "103032-9"
  },
  {
    "id": "vvUKkXgxWuW",
    "name": "Kwikuba Dispensary",
    "code": "103416-4"
  },
  {
    "id": "XpN20BDbg9d",
    "name": "Kome Dispensary",
    "code": "103287-9"
  },
  {
    "id": "QbXo2aX9pYX",
    "name": "Kurugee Dispensary",
    "code": "103342-2"
  },
  {
    "id": "sk8jFFdSASZ",
    "name": "Bwai Dispensary",
    "code": "100645-1"
  },
  {
    "id": "uSBBNxO3jss",
    "name": "Kiemba Dispensary",
    "code": "102739-0"
  },
  {
    "id": "Pz8cVSzuFb3",
    "name": "Kigera Etuma RC Dispensary",
    "code": "102703-6"
  },
  {
    "id": "ZVkLTkDfCZB",
    "name": "Magereza Dispensary",
    "code": "103934-6"
  },
  {
    "id": "gjsiBWhZGmp",
    "name": "Manga Dispensary",
    "code": "104239-9"
  },
  {
    "id": "HN1bp3kb6zh",
    "name": "Polisi Musoma Dispensary",
    "code": "105722-3"
  },
  {
    "id": "JRY2yNxSH0c",
    "name": "Mwisenge Dispensary",
    "code": "106026-8"
  },
  {
    "id": "eAn1a9iEFcu",
    "name": "Nyakato Dispensary",
    "code": "106668-7"
  },
  {
    "id": "IWhyi6GOuGe",
    "name": "Makoko RC Dispensary",
    "code": "104111-0"
  },
  {
    "id": "ZKc0UnsXnC6",
    "name": "Jema Dispensary",
    "code": "104298-5"
  },
  {
    "id": "ZaxP3TptVPV",
    "name": "Nyamatare Dispensary",
    "code": "106701-6"
  },
  {
    "id": "PJvzU0KWzqM",
    "name": "Akim Maternity Home Dispensary",
    "code": "110976-8"
  },
  {
    "id": "Nb4CR690bSY",
    "name": "Makoko Dispensary",
    "code": "104110-2"
  },
  {
    "id": "MqzzILFEDP9",
    "name": "JWTZ Makoko Dispensary",
    "code": "104112-8"
  },
  {
    "id": "CvQrG4oilmw",
    "name": "Iringo Dispensary",
    "code": "101858-9"
  },
  {
    "id": "Fzroj6IRqw6",
    "name": "Rwamlimi Dispensary",
    "code": "107196-8"
  },
  {
    "id": "kSqtqq10ZWq",
    "name": "Nyasho Health Center",
    "code": "106826-1"
  },
  {
    "id": "m37ERPYlARB",
    "name": "Kwangwa Dispensary",
    "code": "103384-4"
  },
  {
    "id": "FLTFKZfGD9f",
    "name": "AICT Bweri Dispensary",
    "code": "100058-7"
  },
  {
    "id": "yyjhuiEmEMV",
    "name": "Bweri Health Center",
    "code": "100658-4"
  },
  {
    "id": "l4h7HkytkLz",
    "name": "SDA Dispensary",
    "code": "106702-4"
  },
  {
    "id": "WcO4B5uddXP",
    "name": "AICT Nyasho Dispensary",
    "code": "100059-5"
  },
  {
    "id": "JvUVUZ8fnze",
    "name": "Nyakato Red Cross Dispensary",
    "code": "106670-3"
  },
  {
    "id": "nGDhCvLklNc",
    "name": "COPTIC Health Center",
    "code": "100930-7"
  },
  {
    "id": "oll24JbWpCn",
    "name": "Omega Health Center",
    "code": "106926-9"
  },
  {
    "id": "cw9yLfhLq98",
    "name": "Buhare Dispensary",
    "code": "100471-2"
  },
  {
    "id": "j2CqtdjDvFb",
    "name": "Marie Stopes Dispensary",
    "code": "104335-5"
  },
  {
    "id": "yfUHHuWADJZ",
    "name": "Bethsaida Health Center",
    "code": "100356-5"
  },
  {
    "id": "l9yJY53nX6C",
    "name": "Park Nyigoti Dispensary",
    "code": "106979-8"
  },
  {
    "id": "sMCRwzGRpVE",
    "name": "Rigicha Dispensary",
    "code": "107086-1"
  },
  {
    "id": "Fk7a4MhzziB",
    "name": "Nyerere DD Hospital",
    "code": "106847-7"
  },
  {
    "id": "DS16ADkA09r",
    "name": "Gantamome Dispensary",
    "code": "101181-6"
  },
  {
    "id": "HZNngge9K6A",
    "name": "Iseresere Dispensary",
    "code": "101901-7"
  },
  {
    "id": "jsyK0qE9llb",
    "name": "Nyamatoke Dispensary",
    "code": "106705-7"
  },
  {
    "id": "YMOVWO6Df8b",
    "name": "Nyakitono Dispensary",
    "code": "106679-4"
  },
  {
    "id": "v6qvv6SwHIO",
    "name": "Mugumu RCH B Health Center",
    "code": "105639-9"
  },
  {
    "id": "IRMAkdVISii",
    "name": "Isseco Dispensary",
    "code": "101932-2"
  },
  {
    "id": "mYGQNJSTErp",
    "name": "Nyiboko Dispensary",
    "code": "106849-3"
  },
  {
    "id": "sv1j0tHalow",
    "name": "Nyansurura Dispensary",
    "code": "106788-3"
  },
  {
    "id": "GSgUAk5Wi6f",
    "name": "Itununu Dispensary",
    "code": "102018-9"
  },
  {
    "id": "RVQNqxVEkRq",
    "name": "Mahabusu Dispensary",
    "code": "109223-8"
  },
  {
    "id": "ydvuQs1azKG",
    "name": "Seronera N.Park Dispensary",
    "code": "107379-0"
  },
  {
    "id": "QFD46M0LS59",
    "name": "Fort Ikoma Dispensary",
    "code": "101152-7"
  },
  {
    "id": "y9Hl9CQsffV",
    "name": "Nyamisingisi Dispensary",
    "code": "106735-4"
  },
  {
    "id": "jjciWStuVCn",
    "name": "Nyamitita Dispensary",
    "code": "106738-8"
  },
  {
    "id": "nzCLSJwdeco",
    "name": "Huduma Dispensary",
    "code": "101396-0"
  },
  {
    "id": "ZVbvfJfYKZG",
    "name": "Bwitengi Dispensary",
    "code": "100664-2"
  },
  {
    "id": "yjbSNYLiIlB",
    "name": "Nyamburi Dispensary",
    "code": "106715-6"
  },
  {
    "id": "pLKLbGFRi1k",
    "name": "Nyichoka Dispensary",
    "code": "106850-1"
  },
  {
    "id": "yWvdjGgkYN8",
    "name": "RCH A Dispensary",
    "code": "105638-1"
  },
  {
    "id": "NQ4IqbA1TfE",
    "name": "Gesarya Dispensary",
    "code": "101202-0"
  },
  {
    "id": "anmxqs7Yssv",
    "name": "Iramba Health Center",
    "code": "101848-0"
  },
  {
    "id": "CHwJMf460xf",
    "name": "Grumeti Dispensary",
    "code": "101273-1"
  },
  {
    "id": "FYxuAlb73eO",
    "name": "Kada Dispensary",
    "code": "100671-7"
  },
  {
    "id": "mfoCCbvCXa8",
    "name": "Remng`orori Dispensary",
    "code": "107082-0"
  },
  {
    "id": "iiOQQgVO9SF",
    "name": "Bilila Dispensary",
    "code": "100367-2"
  },
  {
    "id": "NVHqzhTGq8p",
    "name": "Machochwe Health Center",
    "code": "103835-5"
  },
  {
    "id": "YAWWEXLRJvy",
    "name": "Rwamchanga Dispensary",
    "code": "107192-7"
  },
  {
    "id": "g3DVo6YLLVw",
    "name": "Mosongo Dispensary",
    "code": "105313-1"
  },
  {
    "id": "SCqxSdkke9o",
    "name": "Merenga Dispensary",
    "code": "104740-6"
  },
  {
    "id": "fXShl7viRGi",
    "name": "Rung`abure Dispensary",
    "code": "107159-6"
  },
  {
    "id": "vLGUKG47BuY",
    "name": "Mbalibali Dispensary",
    "code": "104559-0"
  },
  {
    "id": "yx4nfFLxNM0",
    "name": "Gusuhi Dispensary",
    "code": "101276-4"
  },
  {
    "id": "dVB49aTXrG2",
    "name": "Musati Dispensary",
    "code": "105718-1"
  },
  {
    "id": "J6GOLYxYRzW",
    "name": "Nyankomogo Dispensary",
    "code": "106783-4"
  },
  {
    "id": "RvGbs8BKfnG",
    "name": "Bonchugu Dispensary",
    "code": "100406-8"
  },
  {
    "id": "T6CehMWUv9k",
    "name": "Maburi Dispensary",
    "code": "103827-2"
  },
  {
    "id": "KPRhjSjbi3k",
    "name": "Majimoto Dispensary",
    "code": "104064-1"
  },
  {
    "id": "GTPQqDnhMuL",
    "name": "Issenye Dispensary",
    "code": "101934-8"
  },
  {
    "id": "DzqKb7glAD3",
    "name": "Natta Health Center",
    "code": "106217-3"
  },
  {
    "id": "cY9OcNeo8fd",
    "name": "Kebanchebanche Health Center",
    "code": "102528-7"
  },
  {
    "id": "EBP3dMCNfdN",
    "name": "Masinki Dispensary",
    "code": "104412-2"
  },
  {
    "id": "VGlecvhSHik",
    "name": "Kemugesi Health Center",
    "code": "102537-8"
  },
  {
    "id": "doPeH8Br7hT",
    "name": "Wagete Dispensary",
    "code": "108295-7"
  },
  {
    "id": "SOkJDiYZU7h",
    "name": "Kisaka Dispensary",
    "code": "103061-8"
  },
  {
    "id": "DgoEytzce6M",
    "name": "Kenyana Dispensary",
    "code": "102542-8"
  },
  {
    "id": "yTxPshafws8",
    "name": "Robanda Health Center",
    "code": "107092-9"
  },
  {
    "id": "IhQ1ANqG9Lo",
    "name": "Kisaka KMT Dispensary",
    "code": "103062-6"
  },
  {
    "id": "TIUtF0Fe471",
    "name": "Tabora B Dispensary",
    "code": "107700-7"
  },
  {
    "id": "ffdBw10iJ3S",
    "name": "Burito Dispensary",
    "code": "100012-4"
  },
  {
    "id": "DeKAE0uqTVG",
    "name": "Sirari Health Center",
    "code": "107497-0"
  },
  {
    "id": "wwMUV5AArrQ",
    "name": "Ntagacha Dispensary",
    "code": "106593-7"
  },
  {
    "id": "z43Ju07ZL6V",
    "name": "Keisangora Dispensary",
    "code": "102529-5"
  },
  {
    "id": "K8z9sTmypTw",
    "name": "Nkerege Dispensary",
    "code": "110970-1"
  },
  {
    "id": "itQfryZunmk",
    "name": "Urafiki Maternity Home",
    "code": "108147-0"
  },
  {
    "id": "uEkDNZkoKMy",
    "name": "Nyarero Health Center",
    "code": "106800-6"
  },
  {
    "id": "H6vAzKNPfr6",
    "name": "Matongo Dispensary",
    "code": "110973-5"
  },
  {
    "id": "HB9ABTewvez",
    "name": "Perose Dispensary",
    "code": "106991-3"
  },
  {
    "id": "K5ejI2x9H5M",
    "name": "Surubu Dispensary",
    "code": "107684-3"
  },
  {
    "id": "nFBSETZfxNb",
    "name": "Muriba Health Center",
    "code": "105702-5"
  },
  {
    "id": "PyJV4py7JI9",
    "name": "Kitenga Dispensary",
    "code": "103170-7"
  },
  {
    "id": "aQuQPj8l1ob",
    "name": "Kiongera Dispensary",
    "code": "102985-9"
  },
  {
    "id": "AkqmYtciPaQ",
    "name": "Nyamongo Dispensary",
    "code": "106743-8"
  },
  {
    "id": "bWijix0AMy0",
    "name": "Kubitere Dispensary",
    "code": "110796-0"
  },
  {
    "id": "UwMVabkh5RM",
    "name": "Gibaso Dispensary",
    "code": "101210-3"
  },
  {
    "id": "YxYqGQyxqMg",
    "name": "Neema Prinmat Dispensary",
    "code": "111389-3"
  },
  {
    "id": "UMq6WTpBtq3",
    "name": "Mtana Dispensary",
    "code": "105530-0"
  },
  {
    "id": "Vpc6W518Y17",
    "name": "Bungurere Dispensary",
    "code": "100575-0"
  },
  {
    "id": "tBFWTbksAip",
    "name": "Bumera Dispensary",
    "code": "100559-4"
  },
  {
    "id": "K02QBVDjwaB",
    "name": "Nyamwaga Dispensary",
    "code": "106751-1"
  },
  {
    "id": "a8rk4qnXkhm",
    "name": "Kitagutiti Dispensary",
    "code": "103143-4"
  },
  {
    "id": "fIHWLaVOAGn",
    "name": "Will`s Memorial Health Center",
    "code": "101286-3"
  },
  {
    "id": "wl0KCHvPR4K",
    "name": "Genkuru Dispensary",
    "code": "101199-8"
  },
  {
    "id": "uwMfL6pmROP",
    "name": "Nyasaricho Dispensary",
    "code": "106819-6"
  },
  {
    "id": "B55P2HLcEPR",
    "name": "Nyangoto Health Center",
    "code": "106774-3"
  },
  {
    "id": "vdJCnNWRvPs",
    "name": "Masanga Health Center",
    "code": "104378-5"
  },
  {
    "id": "m4h6aPc9hEp",
    "name": "Nyabisaga Dispensary",
    "code": "110797-8"
  },
  {
    "id": "oysPhhei2lU",
    "name": "ALPHA Maternity Home",
    "code": "100093-4"
  },
  {
    "id": "Da8ddWWvLyn",
    "name": "Rozana Dispensary",
    "code": "107104-2"
  },
  {
    "id": "jjADYsxelZb",
    "name": "Nyantira Dispensary",
    "code": "106791-7"
  },
  {
    "id": "SIWNFCxlTBI",
    "name": "Nyarwana Health Center",
    "code": "106813-9"
  },
  {
    "id": "lDWLjw7C8GU",
    "name": "Magoto Health Center",
    "code": "103987-4"
  },
  {
    "id": "DC6DIEORZ3H",
    "name": "Nyamasanda Dispensary",
    "code": "106700-8"
  },
  {
    "id": "FbGt8WwB9WU",
    "name": "Masike Dispensary",
    "code": "104408-0"
  },
  {
    "id": "A7UNzvWfhxE",
    "name": "Ikoma Dispensary",
    "code": "101661-7"
  },
  {
    "id": "s9blK8GtTDY",
    "name": "Kinesi Health Center",
    "code": "102941-2"
  },
  {
    "id": "eRkTbGHHYMu",
    "name": "Raranya Dispensary",
    "code": "109786-4"
  },
  {
    "id": "e56pTHxWyle",
    "name": "Sokorabolo Dispensary",
    "code": "107519-1"
  },
  {
    "id": "u19UAumuM1W",
    "name": "Changuge Health Center",
    "code": "100736-8"
  },
  {
    "id": "VkR8pe5Fvxo",
    "name": "Bubombi Dispensary",
    "code": "100428-2"
  },
  {
    "id": "fDRTyYrt2Jc",
    "name": "Kuruya Dispensary",
    "code": "103345-5"
  },
  {
    "id": "TkPbopXyZ69",
    "name": "Shirati Hospital",
    "code": "107428-5"
  },
  {
    "id": "md2r2c8l6PY",
    "name": "Utegi Health Center",
    "code": "108201-5"
  },
  {
    "id": "u7ZjzXZM9Y9",
    "name": "Bugire Dispensary",
    "code": "100453-0"
  },
  {
    "id": "fWJINOmJQE4",
    "name": "Radienya Dispensary",
    "code": "107054-9"
  },
  {
    "id": "EVw4WCcIuUn",
    "name": "Komuge Dispensary",
    "code": "107638-9"
  },
  {
    "id": "hbwuFoDUghy",
    "name": "Kogaja Dispensary",
    "code": "103278-8"
  },
  {
    "id": "HWGhCwBJkbm",
    "name": "Nyahongo Dispensary",
    "code": "106647-1"
  },
  {
    "id": "Apwgx6sWRt7",
    "name": "Masonga Health Center",
    "code": "104420-5"
  },
  {
    "id": "M3p6IdldGtu",
    "name": "Sota Dispensary",
    "code": "108497-9"
  },
  {
    "id": "bvZBFfcrkAE",
    "name": "Nyambori Dispensary",
    "code": "106712-3"
  },
  {
    "id": "GS4n9RWPVTA",
    "name": "Kibuyi Dispensary",
    "code": "102633-5"
  },
  {
    "id": "CBJ7uM8PQJD",
    "name": "Chereche Dispensary",
    "code": "100772-3"
  },
  {
    "id": "wOMtV2uTpiH",
    "name": "Baraki Dispensary",
    "code": "100323-5"
  },
  {
    "id": "lrv2MoKbm4c",
    "name": "Bukwe Health Center",
    "code": "100523-0"
  },
  {
    "id": "aN8eVlLcq09",
    "name": "Bethania Dispensary",
    "code": "100355-7"
  },
  {
    "id": "TN1on2SHZAB",
    "name": "Buturi Dispensary",
    "code": "100625-3"
  },
  {
    "id": "x3BCL9sAlfZ",
    "name": "Sayuni Dispensary",
    "code": "107317-0"
  },
  {
    "id": "fSEWhbOBmnJ",
    "name": "Ruhu Dispensary",
    "code": "107142-2"
  },
  {
    "id": "saXSVYfnDtb",
    "name": "Rwang`enyi Dispensary",
    "code": "107199-2"
  },
  {
    "id": "NJj1xQGlvGR",
    "name": "Panyakoo Dispensary",
    "code": "106974-9"
  },
  {
    "id": "WvJrPEJX1jp",
    "name": "Ochuna Dispensary",
    "code": "106881-6"
  },
  {
    "id": "Haf3VpIR7io",
    "name": "Kothora Dispensary",
    "code": "109753-4"
  },
  {
    "id": "kOkur6ln6ho",
    "name": "Nyanchabakenye Dispensary",
    "code": "106756-0"
  },
  {
    "id": "qyJrdZod2qm",
    "name": "Nyasoko Dispensary",
    "code": "106828-7"
  },
  {
    "id": "RmHZWyuuYXR",
    "name": "Shed Sota Dispensary",
    "code": "107554-8"
  },
  {
    "id": "mZecwQ0cujq",
    "name": "Nyasoro Dispensary",
    "code": "106829-5"
  },
  {
    "id": "mUwwfTaHDLi",
    "name": "Sakawa Dispensary",
    "code": "107238-8"
  },
  {
    "id": "R8eSGrNCz57",
    "name": "Nyarombo Health Center",
    "code": "106801-4"
  },
  {
    "id": "EwIXHmawsnp",
    "name": "Nyamagaro Dispensary",
    "code": "106689-3"
  },
  {
    "id": "xJARkwPQyUI",
    "name": "Baraki Health Center",
    "code": "100324-3"
  },
  {
    "id": "Qlg9f0IBI7p",
    "name": "Matale Dispensary",
    "code": "104441-1"
  },
  {
    "id": "V4fJa5aczXw",
    "name": "Lugeye Health Center",
    "code": "103641-7"
  },
  {
    "id": "Ky9YWUu0Rs0",
    "name": "Kinango Dispensary",
    "code": "102932-1"
  },
  {
    "id": "UZ1NeDks7bo",
    "name": "Ihayabuyaga Dispensary",
    "code": "101614-6"
  },
  {
    "id": "Um6vKzE0msj",
    "name": "Sese Dispensary",
    "code": "109277-4"
  },
  {
    "id": "KR2MSSumgIF",
    "name": "Lutale Dispensary",
    "code": "103763-9"
  },
  {
    "id": "WpUXndCzyCR",
    "name": "Igekemaja Dispensary",
    "code": "101539-5"
  },
  {
    "id": "JHlR9uOgUtL",
    "name": "Busalanga Dispensary",
    "code": "100581-8"
  },
  {
    "id": "SLLAsxFTIKW",
    "name": "Nyasato Dispensary",
    "code": "106821-2"
  },
  {
    "id": "m0VZuNa7sE9",
    "name": "Kongolo Dispensary",
    "code": "103306-7"
  },
  {
    "id": "grCkInoUmyt",
    "name": "Sayaka Dispensary",
    "code": "107314-7"
  },
  {
    "id": "BJTTL5V6m7n",
    "name": "Kigangama Dispensary",
    "code": "102696-2"
  },
  {
    "id": "fDnychdT7nC",
    "name": "Buhumbi Dispensary",
    "code": "100485-2"
  },
  {
    "id": "PGL9Ii2xx2M",
    "name": "Shishani Dispensary",
    "code": "107431-9"
  },
  {
    "id": "BQN3fFzn3nO",
    "name": "Kisesa B Dispensary",
    "code": "103092-3"
  },
  {
    "id": "gjqq8nPoTxM",
    "name": "Bubinza Dispensary",
    "code": "100426-6"
  },
  {
    "id": "yzOXkmyy8f0",
    "name": "Bujashi Dispensary",
    "code": "100488-6"
  },
  {
    "id": "sH08IDqwlwE",
    "name": "Salamabugatu Dispensary",
    "code": "107248-7"
  },
  {
    "id": "wX3L5Veiq32",
    "name": "Nyanguge Health Center",
    "code": "106775-0"
  },
  {
    "id": "LHmD6SaxUej",
    "name": "Lumeji Dispensary",
    "code": "103710-0"
  },
  {
    "id": "EPFEU6xvEZW",
    "name": "Bakwata Dispensary",
    "code": "109449-9"
  },
  {
    "id": "xaJPQIlQAmY",
    "name": "Kitongosima Dispensary",
    "code": "103190-5"
  },
  {
    "id": "Olxhwz3drsS",
    "name": "Nhobola Dispensary",
    "code": "106465-8"
  },
  {
    "id": "a3SKC4cNGGg",
    "name": "Komaswa Dispensary",
    "code": "107070-5"
  },
  {
    "id": "np8ayDTa84U",
    "name": "Kanyama Dispensary",
    "code": "108684-2"
  },
  {
    "id": "JoGwlUD59m3",
    "name": "Kabila Health Center",
    "code": "108606-5"
  },
  {
    "id": "VtHG3IvWEj7",
    "name": "Tukuyu Dispensary",
    "code": "108602-4"
  },
  {
    "id": "acm8BeaDaxI",
    "name": "Busekwa Dispensary",
    "code": "110454-6"
  },
  {
    "id": "WOVSS7sbL3h",
    "name": "Kahangara Health Center",
    "code": "102183-1"
  },
  {
    "id": "d0AFGT5GD6W",
    "name": "Mwabulenga Dispensary",
    "code": "105795-9"
  },
  {
    "id": "c2u69M9jT45",
    "name": "Isolo Dispensary",
    "code": "101925-6"
  },
  {
    "id": "b68EjFwLTQm",
    "name": "Welamasonga Dispensary",
    "code": "108356-7"
  },
  {
    "id": "ISe1IZjwsXe",
    "name": "Ijinga Dispensary",
    "code": "101634-4"
  },
  {
    "id": "Ot4SBA4EQii",
    "name": "Igombe Dispensary",
    "code": "101564-3"
  },
  {
    "id": "cacTRnDnXyY",
    "name": "Buluma Dispensary",
    "code": "100546-1"
  },
  {
    "id": "aPv8lYBmyUG",
    "name": "Mwamabanza Dispensary",
    "code": "105845-2"
  },
  {
    "id": "LSNi3v65zcn",
    "name": "Huruma Dispensary",
    "code": "110877-8"
  },
  {
    "id": "KIZI2A4NlvX",
    "name": "Magereza Dispensary",
    "code": "103937-9"
  },
  {
    "id": "bWCz8FC2WUk",
    "name": "Mwamanga Dispensary",
    "code": "105860-1"
  },
  {
    "id": "cKVdmfvRvO2",
    "name": "Bugabu Dispensary",
    "code": "110394-4"
  },
  {
    "id": "rda971TdGiS",
    "name": "Kisesa A Health Center",
    "code": "110975-0"
  },
  {
    "id": "uSJWYX0qUkz",
    "name": "Chandulu Dispensary",
    "code": "100731-9"
  },
  {
    "id": "mwhnku2XpVG",
    "name": "Upendo Dispensary",
    "code": "108124-9"
  },
  {
    "id": "oIi2Hoq0xMk",
    "name": "Mahaha Dispensary",
    "code": "104007-0"
  },
  {
    "id": "UODgtRo0Vg0",
    "name": "Mwangika Health Center",
    "code": "105931-0"
  },
  {
    "id": "BYdgdgH3r6z",
    "name": "Buhama Dispensary",
    "code": "100466-2"
  },
  {
    "id": "rmXM0W7wfdd",
    "name": "Luharanyonga Dispensary",
    "code": "103661-5"
  },
  {
    "id": "GAUCE13wlYA",
    "name": "Bukokwa Dispensary",
    "code": "100508-1"
  },
  {
    "id": "zomhueY4NT4",
    "name": "Katoma Dispensary",
    "code": "102481-9"
  },
  {
    "id": "WwrQBSB8i1a",
    "name": "Kahunda Dispensary",
    "code": "102190-6"
  },
  {
    "id": "uVynzhlWc4k",
    "name": "Kome Health Center",
    "code": "103288-7"
  },
  {
    "id": "btOmX6K5Bs5",
    "name": "Bupandwa Dispensary",
    "code": "100001-7"
  },
  {
    "id": "Bc5Tgdjo4h2",
    "name": "Nyakasungwa Dispensary",
    "code": "106664-6"
  },
  {
    "id": "NvFalk8Ia0v",
    "name": "Nyakarilo Health Center",
    "code": "106661-2"
  },
  {
    "id": "nSNMhF1W3KS",
    "name": "Nyamadoke Dispensary",
    "code": "106687-7"
  },
  {
    "id": "PPpmUVi3qry",
    "name": "Sukuma Dispensary",
    "code": "107656-1"
  },
  {
    "id": "yh3q6IiphY6",
    "name": "Kisaba Dispensary",
    "code": "103060-0"
  },
  {
    "id": "V13qncrQbsk",
    "name": "Itabagumba Dispensary",
    "code": "101948-8"
  },
  {
    "id": "E7nYMMj53uU",
    "name": "Kabaganga Dispensary",
    "code": "111741-5"
  },
  {
    "id": "YipLWVOMzB5",
    "name": "Luchili Dispensary",
    "code": "103617-7"
  },
  {
    "id": "P4lDlhF1trO",
    "name": "Kayenze Dispensary",
    "code": "108478-9"
  },
  {
    "id": "M3ef7vD4wp0",
    "name": "Buhindi Dispensary",
    "code": "100476-1"
  },
  {
    "id": "mF9ovQGVXHF",
    "name": "Kakobe Health Center",
    "code": "108703-0"
  },
  {
    "id": "tSbF5Ur8aad",
    "name": "Nyehunge Health Center",
    "code": "106839-4"
  },
  {
    "id": "WF0f4sHopMH",
    "name": "Nyanzenda Dispensary",
    "code": "106796-6"
  },
  {
    "id": "HBihzvxpZJ6",
    "name": "Bilulumo Dispensary",
    "code": "100368-0"
  },
  {
    "id": "MPhd2AVg9nq",
    "name": "Busekeseke Dispensary",
    "code": "100593-3"
  },
  {
    "id": "nwaO2DpgW2U",
    "name": "Lushamba Dispensary",
    "code": "103755-5"
  },
  {
    "id": "DvCuoLb0FPg",
    "name": "Kasisa Dispensary",
    "code": "102439-7"
  },
  {
    "id": "ZUjFBmk63b3",
    "name": "Maisome Dispensary",
    "code": "104041-9"
  },
  {
    "id": "Lqf2x5itnyY",
    "name": "Luhorongoma Dispensary",
    "code": "103673-0"
  },
  {
    "id": "DKk7gyuk0es",
    "name": "Nyangalamila Dispensary",
    "code": "106762-8"
  },
  {
    "id": "ax0ggf8spM5",
    "name": "Iligamba Dispensary",
    "code": "101739-1"
  },
  {
    "id": "yApeUHePcJp",
    "name": "Kalebezo Dispensary",
    "code": "102231-8"
  },
  {
    "id": "k8ZllArduip",
    "name": "Lugata Dispensary",
    "code": "103639-1"
  },
  {
    "id": "J3nK2s15c1m",
    "name": "Kafunzo Dispensary",
    "code": "102156-7"
  },
  {
    "id": "WFZjrudKRko",
    "name": "Nguge Dispensary",
    "code": "106427-8"
  },
  {
    "id": "h6VbzLUAvok",
    "name": "Mwaniko Dispensary",
    "code": "105940-1"
  },
  {
    "id": "ojgD1dUpOoq",
    "name": "Mwawile Dispensary",
    "code": "105981-5"
  },
  {
    "id": "yXmJqICiQOg",
    "name": "Kanyerere Dispensary",
    "code": "102343-1"
  },
  {
    "id": "xHJMcEXMv0z",
    "name": "Mwamazengo Dispensary",
    "code": "105873-4"
  },
  {
    "id": "GGUETrZWCQV",
    "name": "Idetemya Dispensary",
    "code": "101477-8"
  },
  {
    "id": "i0fpwYOLwL8",
    "name": "Ng`ombe Dispensary",
    "code": "106404-7"
  },
  {
    "id": "WU3B2V1wi7h",
    "name": "Nkinga Dispensary",
    "code": "106520-0"
  },
  {
    "id": "Qi5lJIDo5mr",
    "name": "Koromije Health Center",
    "code": "103319-0"
  },
  {
    "id": "tTOGWaGNIZA",
    "name": "Mondo Dispensary",
    "code": "105285-1"
  },
  {
    "id": "lPP1qKIzFgG",
    "name": "Igongwa Dispensary",
    "code": "101570-0"
  },
  {
    "id": "mSUQpAcjmWD",
    "name": "Kaunda Dispensary",
    "code": "102502-2"
  },
  {
    "id": "RAYFl5c5FwB",
    "name": "Mwamboku Dispensary",
    "code": "105878-3"
  },
  {
    "id": "xGVugh36NJy",
    "name": "Buhingo Dispensary",
    "code": "100477-9"
  },
  {
    "id": "TQuWminDW9I",
    "name": "Bugisha Dispensary",
    "code": "100454-8"
  },
  {
    "id": "mKtj7PfOURG",
    "name": "Igokelo Dispensary",
    "code": "101554-4"
  },
  {
    "id": "vbM6zbK9D0o",
    "name": "Mahando Dispensary",
    "code": "104009-6"
  },
  {
    "id": "bpd1CFgPCvU",
    "name": "Busongo Health Center",
    "code": "100611-3"
  },
  {
    "id": "O43u7dLtmXG",
    "name": "Isamilo Dispensary",
    "code": "101875-3"
  },
  {
    "id": "kl7OwUO4R8r",
    "name": "Gambajiga Dispensary",
    "code": "101178-2"
  },
  {
    "id": "CHWJ2loKqFH",
    "name": "Ibongoya Dispensary",
    "code": "101447-1"
  },
  {
    "id": "cHZuS0dSzdn",
    "name": "Mwagiligili Dispensary",
    "code": "105815-5"
  },
  {
    "id": "FIwTG1kOZwc",
    "name": "Bukumbi Camp Dispensary",
    "code": "100519-8"
  },
  {
    "id": "sm8T0qoDEoo",
    "name": "Buhunda Dispensary",
    "code": "100486-0"
  },
  {
    "id": "NawQh3J8XlT",
    "name": "Mwambola Dispensary",
    "code": "105879-1"
  },
  {
    "id": "wVqMr7JGo3i",
    "name": "Mwagala Dispensary",
    "code": "105811-4"
  },
  {
    "id": "oh07E92qQog",
    "name": "Kijima Dispensary",
    "code": "102760-6"
  },
  {
    "id": "pnPxHINNZB6",
    "name": "Mbarika Health Center",
    "code": "104574-9"
  },
  {
    "id": "ykbLIZyXO4O",
    "name": "Lubiri Dispensary",
    "code": "103612-8"
  },
  {
    "id": "bB9u8p59RRx",
    "name": "Isesa Dispensary",
    "code": "101903-3"
  },
  {
    "id": "BZ3XC9ferSV",
    "name": "Misasi Health Center",
    "code": "104971-7"
  },
  {
    "id": "dSBkmitCAZf",
    "name": "Karume Health Center",
    "code": "102388-6"
  },
  {
    "id": "GRgjt4ZPRsk",
    "name": "Huduma Kilimahewa Health Center",
    "code": "101397-8"
  },
  {
    "id": "YWHzS7LVqTs",
    "name": "Grambah Health Centre",
    "code": "111327-3"
  },
  {
    "id": "p08mmqnEeyj",
    "name": "Kiloleli Juu Health Center",
    "code": "102863-8"
  },
  {
    "id": "dCisPF5yU8Z",
    "name": "Bwiru Girls Dispensary",
    "code": "100662-6"
  },
  {
    "id": "kAiMHnhtXz2",
    "name": "Saidia Watoto Dispensary",
    "code": "109750-0"
  },
  {
    "id": "Sh6A5jDii7c",
    "name": "Bwiru Boys Dispensary",
    "code": "100661-8"
  },
  {
    "id": "fgX57wBiCT4",
    "name": "Juwa Dispensary",
    "code": "102109-6"
  },
  {
    "id": "BF847IiPDXq",
    "name": "Upendo Health Center",
    "code": "109225-3"
  },
  {
    "id": "GEwbLB8czUY",
    "name": "Kiloleli Chamwenda Dispensary",
    "code": "102864-6"
  },
  {
    "id": "vTxnZfpFDN5",
    "name": "UMATI Dispensary",
    "code": "108090-2"
  },
  {
    "id": "GKMN0HnBKNv",
    "name": "Mwanza Dispensary",
    "code": "105948-4"
  },
  {
    "id": "EBhxYqpZJBT",
    "name": "CADA Dispensary",
    "code": "110965-1"
  },
  {
    "id": "hATOMtBqofW",
    "name": "Kirumba Dispensary",
    "code": "103048-5"
  },
  {
    "id": "NyvHZsdxGq1",
    "name": "Buzuruga Health Center",
    "code": "100642-8"
  },
  {
    "id": "lC9oACgGXAj",
    "name": "Kataraiya Dispensary",
    "code": "102465-2"
  },
  {
    "id": "JyP2L04D5wd",
    "name": "Pasiansi Dispensary",
    "code": "106980-6"
  },
  {
    "id": "alc4JMFAS4q",
    "name": "Nyamhongolo Dispensary",
    "code": "106718-0"
  },
  {
    "id": "SdX2Xr2Pomc",
    "name": "Tanzania Breweries Dispensary",
    "code": "107761-9"
  },
  {
    "id": "ljaYCirMsQI",
    "name": "663 KJ Dispensary",
    "code": "100022-3"
  },
  {
    "id": "TZEtBqeWDZx",
    "name": "KMT Buswelu Wanze Dispensary",
    "code": "103270-5"
  },
  {
    "id": "uIMXLzjdxcQ",
    "name": "Laja Dispensary",
    "code": "108898-8"
  },
  {
    "id": "egT7q6tlROC",
    "name": "Nyanza Health Centre",
    "code": "111324-0"
  },
  {
    "id": "TUtErZsSwUG",
    "name": "Kahama Dispensary",
    "code": "102180-7"
  },
  {
    "id": "Rr4v0sG75yG",
    "name": "Lugela Dispensary",
    "code": "111326-5"
  },
  {
    "id": "bIkggYCOtcs",
    "name": "Medical Research NIMR Health Center",
    "code": "104716-6"
  },
  {
    "id": "cU7U4LgVL0p",
    "name": "Corner Dispensary",
    "code": "100931-5"
  },
  {
    "id": "r5wLbFzDpIS",
    "name": "Nyerere Dispensary",
    "code": "106846-9"
  },
  {
    "id": "APHShf0UpOY",
    "name": "Sangabuye Health Center",
    "code": "107276-8"
  },
  {
    "id": "GoQ7B8VHHDG",
    "name": "Nyasaka Dispensary",
    "code": "106816-2"
  },
  {
    "id": "yOFe1453Ffm",
    "name": "Ilemela Dispensary",
    "code": "101733-4"
  },
  {
    "id": "OIgQrsRqa3A",
    "name": "SDA -Pasiansi Health Center",
    "code": "107339-4"
  },
  {
    "id": "ZhEGfqACZdy",
    "name": "Tumaini Dispensary",
    "code": "107931-8"
  },
  {
    "id": "Kelbyr3JdRo",
    "name": "Katson Dispensary",
    "code": "111325-7"
  },
  {
    "id": "wUsvfG5xDBD",
    "name": "Nyakato Dispensary",
    "code": "110963-6"
  },
  {
    "id": "xZzqCHG2hia",
    "name": "Victoria Med Care Dispensary",
    "code": "108248-6"
  },
  {
    "id": "Fp9jJvil2EV",
    "name": "Linka Dispensary",
    "code": "109226-1"
  },
  {
    "id": "vzeFK3W7WTT",
    "name": "Kabusungu Dispensary",
    "code": "102148-4"
  },
  {
    "id": "OH5zB3KzHss",
    "name": "Nyamwilolelwa Dispensary",
    "code": "106754-5"
  },
  {
    "id": "K6i8lTxebqx",
    "name": "Magomeni Dispensary",
    "code": "103977-5"
  },
  {
    "id": "ePaZFHJFj7K",
    "name": "E.L.C.T Health Center",
    "code": "101048-7"
  },
  {
    "id": "n9gFlNTDkUZ",
    "name": "Luhanga Dispensary",
    "code": "103662-3"
  },
  {
    "id": "x8v2hfjPwx8",
    "name": "Igogwe Dispensary",
    "code": "101551-0"
  },
  {
    "id": "YMAKwCWbRXr",
    "name": "Mwanza Military Hospital",
    "code": "109227-9"
  },
  {
    "id": "cL5oC6yGEuJ",
    "name": "Victoria Kilimahewa Dispensary",
    "code": "108247-8"
  },
  {
    "id": "hpqhXP1WqhA",
    "name": "Mwangika Dispensary",
    "code": "105930-2"
  },
  {
    "id": "SoPL5xbqJhY",
    "name": "Solwe Dispensary",
    "code": "107524-1"
  },
  {
    "id": "FJ8QJL1UCYU",
    "name": "Nyamilama Health Center",
    "code": "106730-5"
  },
  {
    "id": "XhhbExXMosT",
    "name": "Kibitilwa Dispensary",
    "code": "102608-7"
  },
  {
    "id": "whChVobyCJe",
    "name": "Jojilo Dispensary",
    "code": "102099-9"
  },
  {
    "id": "DiFXIfo3M7n",
    "name": "Shilembo Dispensary",
    "code": "107418-6"
  },
  {
    "id": "xU1BKdz5Gml",
    "name": "Nyamikoma Dispensary",
    "code": "106728-9"
  },
  {
    "id": "hILpkwgjPRJ",
    "name": "Kikubiji Dispensary",
    "code": "110971-9"
  },
  {
    "id": "rBAkEbC2ta8",
    "name": "Mwankulwe Dispensary",
    "code": "105943-5"
  },
  {
    "id": "dHcG0CB9neU",
    "name": "Kigongo Dispensary",
    "code": "109330-1"
  },
  {
    "id": "MwXDblMfqXG",
    "name": "Milyungu Dispensary",
    "code": "104938-6"
  },
  {
    "id": "hDLX8GEJ15K",
    "name": "Ilula Dispensary",
    "code": "101766-4"
  },
  {
    "id": "xwwYx6q1UCi",
    "name": "Nyambiti Health Center",
    "code": "106710-7"
  },
  {
    "id": "JojgkqlUtxo",
    "name": "Bugembe Dispensary",
    "code": "100450-6"
  },
  {
    "id": "IXfG73342qY",
    "name": "Walla Dispensary",
    "code": "108299-9"
  },
  {
    "id": "XASigRHkCin",
    "name": "Inala Dispensary",
    "code": "101806-8"
  },
  {
    "id": "pPTqlkBSr8r",
    "name": "Nyamigamba Dispensary",
    "code": "106722-2"
  },
  {
    "id": "Owd1Zm9oJeX",
    "name": "Malemve Dispensary",
    "code": "104172-2"
  },
  {
    "id": "iuCNLlgR6zc",
    "name": "Ilumba Dispensary",
    "code": "101771-4"
  },
  {
    "id": "eC8vmoOZFM7",
    "name": "Kiliwi Dispensary",
    "code": "102856-2"
  },
  {
    "id": "AkdMuNxFtAH",
    "name": "Talaga Dispensary",
    "code": "107719-7"
  },
  {
    "id": "gVO8lKreqJ0",
    "name": "Mwaghalanga Dispensary",
    "code": "105928-6"
  },
  {
    "id": "dkhn0KsJufo",
    "name": "Mwampulu Dispensary",
    "code": "105892-4"
  },
  {
    "id": "nOBhHXPi8ig",
    "name": "Mwanekeyi Dispensary",
    "code": "109739-3"
  },
  {
    "id": "wMBNJlkggVk",
    "name": "Mwitambu Dispensary",
    "code": "106031-8"
  },
  {
    "id": "w6i2fCvTOD5",
    "name": "Runere Dispensary",
    "code": "107158-8"
  },
  {
    "id": "HgBIm0EVW8h",
    "name": "Huduma Dispensary",
    "code": "101393-7"
  },
  {
    "id": "qRnpVCZzGbe",
    "name": "Hungumalwa Dispensary",
    "code": "109539-7"
  },
  {
    "id": "yt7CswVUj95",
    "name": "Gereza Ngudu Dispensary",
    "code": "109571-0"
  },
  {
    "id": "CGs0B8K9QOD",
    "name": "Lyoma Dispensary",
    "code": "103803-3"
  },
  {
    "id": "LYxdwXZQvC7",
    "name": "Nyambuyi Dispensary",
    "code": "106716-4"
  },
  {
    "id": "TTsk55hwUYe",
    "name": "Mwabilanda Dispensary",
    "code": "105790-0"
  },
  {
    "id": "lTbeFFqv69r",
    "name": "Izizimba Dispensary",
    "code": "102056-9"
  },
  {
    "id": "wQRMBuhkEnJ",
    "name": "Anamed Dispensary",
    "code": "100123-9"
  },
  {
    "id": "S1v3kR96YHp",
    "name": "Mwaging`hi Dispensary",
    "code": "108473-0"
  },
  {
    "id": "PGnkA60he8l",
    "name": "Ngumo Health Center",
    "code": "106440-1"
  },
  {
    "id": "zjRVJZvebTS",
    "name": "Bugandando Dispensary",
    "code": "109450-7"
  },
  {
    "id": "iZe75DbCSAW",
    "name": "Ndamhi Dispensary",
    "code": "109616-3"
  },
  {
    "id": "au6zptGO7L8",
    "name": "Mahiga Dispensary",
    "code": "104022-9"
  },
  {
    "id": "kDR2OF3LdY8",
    "name": "Panorama Health Center",
    "code": "111272-1"
  },
  {
    "id": "dgTiiIM3Apg",
    "name": "Mwamashimba Health Center",
    "code": "105872-6"
  },
  {
    "id": "HwqBt1wbSdn",
    "name": "Manayi Dispensary",
    "code": "104215-9"
  },
  {
    "id": "hjLBZmezxkk",
    "name": "Malya Health Center",
    "code": "104199-5"
  },
  {
    "id": "YP1JwZ122kZ",
    "name": "Mwadubi Dispensary",
    "code": "105804-9"
  },
  {
    "id": "Q5CGfFb7EsF",
    "name": "Maligisu Dispensary",
    "code": "104174-8"
  },
  {
    "id": "uv94kfHjr7i",
    "name": "Buyogo Dispensary",
    "code": "100631-1"
  },
  {
    "id": "lHrCfWxJBDc",
    "name": "Ibindo Dispensary",
    "code": "101440-6"
  },
  {
    "id": "psKeOYTvzGj",
    "name": "Manawa Dispensary",
    "code": "104214-2"
  },
  {
    "id": "NUQM2WLKIqy",
    "name": "Nyang`honge Dispensary",
    "code": "106777-6"
  },
  {
    "id": "CFAJySYpKDp",
    "name": "Malya Chuo cha Michezo Dispensary",
    "code": "109427-5"
  },
  {
    "id": "bZPoKwj3j7W",
    "name": "Bujingwa Dispensary",
    "code": "100490-2"
  },
  {
    "id": "RwpK1Q5Ld0y",
    "name": "Mwakilyambiti Dispensary",
    "code": "105831-2"
  },
  {
    "id": "ftibEgIqim6",
    "name": "Chibuji Dispensary",
    "code": "100779-8"
  },
  {
    "id": "Y3JJQxBmH4j",
    "name": "Shushi Dispensary",
    "code": "107450-9"
  },
  {
    "id": "BKLkejbREQ1",
    "name": "Bungulwa Dispensary",
    "code": "100574-3"
  },
  {
    "id": "A4e0PoawFh4",
    "name": "Kasungamile Dispensary",
    "code": "102456-1"
  },
  {
    "id": "TI1tWsyWadl",
    "name": "Igaka Dispensary",
    "code": "101515-5"
  },
  {
    "id": "xuEB1qUVFM0",
    "name": "Nyamtelela Dispensary",
    "code": "106747-9"
  },
  {
    "id": "k89uIGtfDdP",
    "name": "Busisi Health Center",
    "code": "109728-6"
  },
  {
    "id": "bnkwetdIfKM",
    "name": "Ngoma B Dispensary",
    "code": "106400-5"
  },
  {
    "id": "hBmY8EiJgPe",
    "name": "Buyagu Dispensary",
    "code": "100628-7"
  },
  {
    "id": "VhVVF3Yc28D",
    "name": "Kahumulo Dispensary",
    "code": "102188-0"
  },
  {
    "id": "yuWmlMLLb1E",
    "name": "Isole Dispensary",
    "code": "101923-1"
  },
  {
    "id": "jYQhslPfZSj",
    "name": "Chamabanda Dispensary",
    "code": "100710-3"
  },
  {
    "id": "olq6qdLu6CB",
    "name": "Nyanzumula Dispensary",
    "code": "106798-2"
  },
  {
    "id": "y2GSjUpu0RG",
    "name": "Kagunga Health Center",
    "code": "102176-5"
  },
  {
    "id": "AnV3qUqzHcb",
    "name": "Kishinda Dispensary",
    "code": "103102-0"
  },
  {
    "id": "RwR0iCJRW1V",
    "name": "Balatogwa Dispensary",
    "code": "100289-8"
  },
  {
    "id": "cRK9Y86JN6B",
    "name": "Mama Dispensary",
    "code": "110828-1"
  },
  {
    "id": "L336LkkCHwM",
    "name": "Kasomeko Dispensary",
    "code": "102444-7"
  },
  {
    "id": "bMRhvhamAhy",
    "name": "Kalangalala Dispensary",
    "code": "102225-0"
  },
  {
    "id": "sEuJcyloUE9",
    "name": "Arma Prinmat Dispensary",
    "code": "110974-3"
  },
  {
    "id": "XsIeVXcrY7p",
    "name": "Buzilasoga Dispensary",
    "code": "100639-4"
  },
  {
    "id": "V8fa2zte6Pc",
    "name": "Sengerema Health Center",
    "code": "107369-1"
  },
  {
    "id": "FhxE0TunuuJ",
    "name": "Mayuya Dispensary",
    "code": "104526-9"
  },
  {
    "id": "ClGPxHrvooc",
    "name": "Nyamatongo Dispensary",
    "code": "106706-5"
  },
  {
    "id": "cRFplFMyuZw",
    "name": "Busisi Dispensary",
    "code": "100606-3"
  },
  {
    "id": "MbnHOJum2eX",
    "name": "Sima Dispensary",
    "code": "107470-7"
  },
  {
    "id": "FSLKosimJ8S",
    "name": "Igalula Dispensary",
    "code": "108476-3"
  },
  {
    "id": "yTAkZlAeGh5",
    "name": "Ilekanilo Dispensary",
    "code": "108477-1"
  },
  {
    "id": "S8JgsCRq117",
    "name": "Karumo Dispensary",
    "code": "102390-2"
  },
  {
    "id": "E3J9euPOUMz",
    "name": "Mwabaluhi Dispensary",
    "code": "105786-8"
  },
  {
    "id": "ZLbiOQThI0f",
    "name": "Nyamizeze Dispensary",
    "code": "106740-4"
  },
  {
    "id": "WVPP94WfgmE",
    "name": "Nyanchenche Dispensary",
    "code": "106757-8"
  },
  {
    "id": "V4RHGZvU53R",
    "name": "Kasenyi Dispensary",
    "code": "102420-7"
  },
  {
    "id": "PJheLSK1Ps6",
    "name": "Nyampande Dispensary",
    "code": "106745-3"
  },
  {
    "id": "iQzn0to3bUQ",
    "name": "Igulumuki Dispensary",
    "code": "101581-7"
  },
  {
    "id": "IwXZgQu0Jbq",
    "name": "Mulaga Dispensary",
    "code": "105173-9"
  },
  {
    "id": "eGCLEJHpwRO",
    "name": "Bitoto Dispensary",
    "code": "100381-3"
  },
  {
    "id": "eMcMAJ7AR4a",
    "name": "Sotta Dispensary",
    "code": "108488-8"
  },
  {
    "id": "QnO68KCUq7b",
    "name": "Ngomamtimba Dispensary",
    "code": "106402-1"
  },
  {
    "id": "JFkdaj9BPsf",
    "name": "Sengerema Secondary Dispensary",
    "code": "107371-7"
  },
  {
    "id": "jtnViTBDJjz",
    "name": "Sogoso Dispensary",
    "code": "107513-4"
  },
  {
    "id": "JRBZK3Fibbq",
    "name": "Katunguru Health Center",
    "code": "102497-5"
  },
  {
    "id": "DaTAnD6Ogf3",
    "name": "Juma Kisiwani Dispensary",
    "code": "102106-2"
  },
  {
    "id": "NwzpV62T7aY",
    "name": "Nyamazugo Prinmat Clinic",
    "code": "110829-9"
  },
  {
    "id": "TG3It3ykfiU",
    "name": "KMT Dispensary",
    "code": "110966-9"
  },
  {
    "id": "AVisaT6e2Qv",
    "name": "Tunyenye Dispensary",
    "code": "107955-7"
  },
  {
    "id": "YyiN3MO1SjL",
    "name": "Nyamazugo Dispensary",
    "code": "106707-3"
  },
  {
    "id": "pbYQ6ZFe0sM",
    "name": "Ngoma A Dispensary",
    "code": "106399-9"
  },
  {
    "id": "LoXeUT5EcGa",
    "name": "Sahwa Dispensary",
    "code": "107230-5"
  },
  {
    "id": "wetCt6M7uDm",
    "name": "AAR Dispensary",
    "code": "110968-5"
  },
  {
    "id": "mH6FK4HMfZb",
    "name": "Mahina Msamaria Dispensary",
    "code": "105420-4"
  },
  {
    "id": "zWA90Adi9H8",
    "name": "Shadi Dispensary",
    "code": "107388-1"
  },
  {
    "id": "TBav6Vvowoz",
    "name": "A.I.C.T Makongoro Health Center",
    "code": "100062-9"
  },
  {
    "id": "wbHYScW1nwR",
    "name": "Mwanza Dental Clinic",
    "code": "107073-9"
  },
  {
    "id": "ajNr4Vt02Tm",
    "name": "Gisan Health Center",
    "code": "101221-0"
  },
  {
    "id": "PXOsOSHE7kn",
    "name": "Nazareth Dispensary",
    "code": "109855-7"
  },
  {
    "id": "RNDLmhbzvkP",
    "name": "Huruma Mirongo Dispensary",
    "code": "101423-2"
  },
  {
    "id": "AufxvtIela3",
    "name": "Ng`walida Dispensary",
    "code": "106457-5"
  },
  {
    "id": "yEKxHNTZurY",
    "name": "Nsumba Clinic",
    "code": "106588-7"
  },
  {
    "id": "x2UIdvK3atG",
    "name": "Prinmat Muse Dispensary",
    "code": "110956-0"
  },
  {
    "id": "pPzrsCwBgW3",
    "name": "Good Samaritan Dispensary",
    "code": "101250-9"
  },
  {
    "id": "LCdsBDsLgKu",
    "name": "Mbugani Dispensary",
    "code": "104647-3"
  },
  {
    "id": "vuQNC6IwSgX",
    "name": "Biohealth Dispensary",
    "code": "109610-6"
  },
  {
    "id": "GYn5vrzzZj3",
    "name": "Al-Ijumaa Health Center",
    "code": "100085-0"
  },
  {
    "id": "hsJn0nhyReu",
    "name": "Baylor Clinic",
    "code": "110825-7"
  },
  {
    "id": "LN6GRqSxEUY",
    "name": "John Muniko Dispensary",
    "code": "109636-1"
  },
  {
    "id": "BlkhAzBbIYQ",
    "name": "Igoma Health Center",
    "code": "101562-7"
  },
  {
    "id": "oN0GEKLVJAb",
    "name": "Prinmat Huduma Dispensary",
    "code": "110957-8"
  },
  {
    "id": "X90p53XzPzw",
    "name": "Magera Health Centre",
    "code": "108890-5"
  },
  {
    "id": "jRcRx91Ypt7",
    "name": "Nganza Clinic",
    "code": "106346-0"
  },
  {
    "id": "q8Dua8DMfhU",
    "name": "Prinmat Nanna Dispensary",
    "code": "110958-6"
  },
  {
    "id": "xFwoK3qL6M0",
    "name": "Hageb Health Center",
    "code": "108889-7"
  },
  {
    "id": "bbMPCTaAG30",
    "name": "Mkolani Dispensary",
    "code": "105088-9"
  },
  {
    "id": "WKpTU1w46TF",
    "name": "Mahina Dispensary",
    "code": "104023-7"
  },
  {
    "id": "ongoNmpaThJ",
    "name": "Nyamagana Hospital - District Hospital",
    "code": "106688-5"
  },
  {
    "id": "nnfkUZj1HZw",
    "name": "Salaaman Health Center",
    "code": "107243-8"
  },
  {
    "id": "FXUXBBbVK9J",
    "name": "DVN Anglican Dispensary",
    "code": "100130-4"
  },
  {
    "id": "wtF83NtMlhl",
    "name": "Amani-Igoma Dispensary",
    "code": "100111-4"
  },
  {
    "id": "puTBLqdrg7f",
    "name": "Nyashana JWTZ Clinic",
    "code": "106823-8"
  },
  {
    "id": "P5a6gYcy1PE",
    "name": "512 KJ Dispensary",
    "code": "100020-7"
  },
  {
    "id": "f5BU3apwVAG",
    "name": "Huduma Mashuleni Dispensary",
    "code": "101398-6"
  },
  {
    "id": "uJaBp9WeDKa",
    "name": "Prinmat Huruma Dispensary",
    "code": "110951-1"
  },
  {
    "id": "r4uHOyd3Prb",
    "name": "Usimau Dispensary",
    "code": "108192-6"
  },
  {
    "id": "bELonYMG3l6",
    "name": "Urafiki Community Health Center",
    "code": "108146-2"
  },
  {
    "id": "vOZXdOZUScv",
    "name": "Prison Butimba Dispensary",
    "code": "100620-4"
  },
  {
    "id": "Bzt5TEnH9u6",
    "name": "SAUTI Nyegezi Dispensary",
    "code": "106836-0"
  },
  {
    "id": "jD1Bn5A3sqc",
    "name": "Buhongwa Dispensary",
    "code": "100481-1"
  },
  {
    "id": "uiSVDdKy2Y8",
    "name": "Makongoro Health Center",
    "code": "104128-4"
  },
  {
    "id": "G9FLz8uqYCk",
    "name": "Nyegezi Fisheries Dispensary",
    "code": "106837-8"
  },
  {
    "id": "Wn3QtRSJtJW",
    "name": "Butimba T.T.C Clinic",
    "code": "100621-2"
  },
  {
    "id": "jnrBShEWlIj",
    "name": "Uwela Dispensary",
    "code": "109603-1"
  },
  {
    "id": "DUnDCUC6HqU",
    "name": "Nyegezi Dispensary",
    "code": "106835-2"
  },
  {
    "id": "NMZDcOzrMAd",
    "name": "Amani Chogo Clinic",
    "code": "100110-6"
  },
  {
    "id": "PEXH5vXoaXB",
    "name": "C.F.K Clinic Clinic",
    "code": "100686-5"
  },
  {
    "id": "odKt02luE2i",
    "name": "Star Med. Care Dispensary",
    "code": "110827-3"
  },
  {
    "id": "UXZ0FsDK8ns",
    "name": "Prinmat Damat Dispensary",
    "code": "110972-7"
  },
  {
    "id": "LpJlfSZycUK",
    "name": "TRC Marine Dispensary",
    "code": "107883-1"
  },
  {
    "id": "WuUMEdxSZAb",
    "name": "Igogo Dispensary",
    "code": "101549-4"
  },
  {
    "id": "XyPJXAYClhF",
    "name": "K.M.T Mkuyuni Dispensary",
    "code": "103273-9"
  },
  {
    "id": "w6XGoeEKNKc",
    "name": "Bugarika Dispensary",
    "code": "100448-0"
  },
  {
    "id": "FqAdgHdYu8V",
    "name": "Bugando Referral Hospital",
    "code": "100438-1"
  },
  {
    "id": "tlUB6ZHEUGE",
    "name": "Hurumia Watoto Hospital",
    "code": "101424-0"
  },
  {
    "id": "D0bMnKdaXEv",
    "name": "Fumagila Dispensary",
    "code": "101160-0"
  },
  {
    "id": "PyVFKkV4khE",
    "name": "Biohealth Health Center",
    "code": "100372-2"
  },
  {
    "id": "J5jcnehSjn3",
    "name": "Tambuka reli Dispensary",
    "code": "109474-7"
  },
  {
    "id": "bG9OtuGy400",
    "name": "Nyakahoja Dispensary",
    "code": "106657-0"
  },
  {
    "id": "afj1fPerkyg",
    "name": "Marie Stopes Dispensary",
    "code": "109425-9"
  },
  {
    "id": "n4tPloN9K7i",
    "name": "Ikonda Dispensary",
    "code": "101665-8"
  },
  {
    "id": "pTwTOQ2h5nM",
    "name": "Salawe Health Center",
    "code": "107250-3"
  },
  {
    "id": "amnZJ0LWWsp",
    "name": "Ng`homango Dispensary",
    "code": "106379-1"
  },
  {
    "id": "Xhgja3Vw1Dh",
    "name": "Solwa Dispensary",
    "code": "107523-3"
  },
  {
    "id": "IDRBI1ASOsG",
    "name": "BAKWATA Usanda Dispensary",
    "code": "111220-0"
  },
  {
    "id": "IUAKYFjv2V0",
    "name": "Wazazi Salawe Dispensary",
    "code": "108348-4"
  },
  {
    "id": "zrCFtKU40rH",
    "name": "Lyabukande Dispensary",
    "code": "103790-2"
  },
  {
    "id": "MJiCLCBy2q8",
    "name": "Mwasingu Dispensary",
    "code": "105975-7"
  },
  {
    "id": "cCtP1Yi80Xh",
    "name": "Wazazi Usanda Dispensary",
    "code": "111222-6"
  },
  {
    "id": "GZI9DvrsjhW",
    "name": "Nyashimbi Dispensary",
    "code": "106825-3"
  },
  {
    "id": "tKpHknwYtaL",
    "name": "Zunzuli Dispensary",
    "code": "108430-0"
  },
  {
    "id": "ttGqU2e7fk3",
    "name": "Wazazi Tinde Dispensary",
    "code": "108351-8"
  },
  {
    "id": "lL5FqEqILKj",
    "name": "Wazazi Mwenge Dispensary",
    "code": "111221-8"
  },
  {
    "id": "Ig2HdC0diCI",
    "name": "Mwamala Dispensary",
    "code": "105854-4"
  },
  {
    "id": "wQzD23leXEw",
    "name": "Mwabenda Dispensary",
    "code": "105789-2"
  },
  {
    "id": "N58AzCkwx6r",
    "name": "Usule Dispensary",
    "code": "108191-8"
  },
  {
    "id": "YYcepDaFVu0",
    "name": "Itwangi Dispensary",
    "code": "102021-3"
  },
  {
    "id": "QYzbeE8cOBF",
    "name": "Mwenge Dispensary",
    "code": "106004-5"
  },
  {
    "id": "hdv6m9FCDk3",
    "name": "Mawemilu Dispensary",
    "code": "104510-3"
  },
  {
    "id": "GrbK6WKWENb",
    "name": "Nindo Health Center",
    "code": "106479-9"
  },
  {
    "id": "YS31FRitQDS",
    "name": "Mwajiji Dispensary",
    "code": "105822-1"
  },
  {
    "id": "wlogtttUnRo",
    "name": "Mishepo Dispensary",
    "code": "104975-8"
  },
  {
    "id": "bfbh3s6dILj",
    "name": "Ilola Dispensary",
    "code": "101749-0"
  },
  {
    "id": "aD6ImDZNh0e",
    "name": "Mwasekagi Dispensary",
    "code": "105966-6"
  },
  {
    "id": "Awy8V0Iy9i4",
    "name": "Usanda Dispensary",
    "code": "108164-5"
  },
  {
    "id": "Ds71FYVSpW2",
    "name": "Shilabela Dispensary",
    "code": "107416-0"
  },
  {
    "id": "jvcFsnHMz9Y",
    "name": "BAKWATA Didia Dispensary",
    "code": "110065-0"
  },
  {
    "id": "knFH9hsDfW0",
    "name": "Mwamakalanga Dispensary",
    "code": "105850-2"
  },
  {
    "id": "Vdw7S0fppXL",
    "name": "Nyamalogo Dispensary",
    "code": "106698-4"
  },
  {
    "id": "lEhC97v8f1O",
    "name": "Mwalukwa Dispensary",
    "code": "105843-7"
  },
  {
    "id": "Zq3a9nyasBz",
    "name": "Ihugi Dispensary",
    "code": "101623-7"
  },
  {
    "id": "KHeE2LfqO10",
    "name": "Ihalo Dispensary",
    "code": "101603-9"
  },
  {
    "id": "iccbM1Zwx1q",
    "name": "Sumbigu Dispensary",
    "code": "107664-5"
  },
  {
    "id": "FPD1SGksIU4",
    "name": "Samuye Health Center",
    "code": "107270-1"
  },
  {
    "id": "X1TeY7LxTWq",
    "name": "Bugogo Dispensary",
    "code": "100456-3"
  },
  {
    "id": "wMKQs1Ba6k6",
    "name": "Mahnigana Dispensary",
    "code": "104267-0"
  },
  {
    "id": "b7VtRuNk6HJ",
    "name": "Tinde Health Center",
    "code": "107827-8"
  },
  {
    "id": "uOX2LEOQzBQ",
    "name": "Mendo Dispensary",
    "code": "104729-9"
  },
  {
    "id": "mr6gKOyBUff",
    "name": "Mwakitolyo Dispensary",
    "code": "105833-8"
  },
  {
    "id": "jmzzmbLEa1p",
    "name": "Mwamalulu Dispensary",
    "code": "105858-5"
  },
  {
    "id": "ry03GNj0Hl3",
    "name": "Bukene Dispensary",
    "code": "100499-3"
  },
  {
    "id": "Ht1ZB8qkrhS",
    "name": "Ilobashi Dispensary",
    "code": "101747-4"
  },
  {
    "id": "gXCKOynKegc",
    "name": "Zobogo Dispensary",
    "code": "108422-7"
  },
  {
    "id": "zcPbwTmoV1B",
    "name": "Mwamanyuda Dispensary",
    "code": "105864-3"
  },
  {
    "id": "EqY5wto6QKV",
    "name": "Bubale Dispensary",
    "code": "100422-5"
  },
  {
    "id": "kByruco4egD",
    "name": "Imani Dispensary",
    "code": "101794-6"
  },
  {
    "id": "SKsZD0hblmN",
    "name": "Lutheran Dispensary",
    "code": "107424-4"
  },
  {
    "id": "SyrYRhCJXlR",
    "name": "Ibadakuli Dispensary",
    "code": "101430-7"
  },
  {
    "id": "gEvWiy1iOt1",
    "name": "Ngokolo RC Health Center",
    "code": "106395-7"
  },
  {
    "id": "RbHJsIiQnvG",
    "name": "Savanah Dispensary",
    "code": "107309-7"
  },
  {
    "id": "e1YQ7wTldqC",
    "name": "Lubaga Dispensary",
    "code": "111231-7"
  },
  {
    "id": "shCHozBob6C",
    "name": "Kambarage Health Center",
    "code": "102281-3"
  },
  {
    "id": "CZ3sDuuFWhe",
    "name": "Miti Mirefu Dispensary",
    "code": "110862-0"
  },
  {
    "id": "a6A3TKlaH8D",
    "name": "AICT-ANGAZA Clinic",
    "code": "111236-6"
  },
  {
    "id": "wS9Yq0wJalg",
    "name": "Magereza Dispensary",
    "code": "103940-3"
  },
  {
    "id": "wCIenSBGEHr",
    "name": "Kizumbi Muccobs Dispensary",
    "code": "100896-0"
  },
  {
    "id": "gWfDKHliaQT",
    "name": "Kambarage Police Dispensary",
    "code": "102282-1"
  },
  {
    "id": "nt6RnrXXmop",
    "name": "Galamba Dispensary",
    "code": "101171-7"
  },
  {
    "id": "oSmLABLQyNo",
    "name": "Kizumbi Dispensary",
    "code": "103256-4"
  },
  {
    "id": "eJcIipMqzDh",
    "name": "St. Joseph Dispensary",
    "code": "107598-5"
  },
  {
    "id": "Q6epFGQoJcr",
    "name": "Kolandonto Hospital",
    "code": "103280-4"
  },
  {
    "id": "jqh6Z2jvpQP",
    "name": "Lifeline Dispensary",
    "code": "103496-6"
  },
  {
    "id": "ngozH2IVQIO",
    "name": "Buhangija Dispensary",
    "code": "100470-4"
  },
  {
    "id": "GjHbAs1blGo",
    "name": "Old Shinyanga Dispensary",
    "code": "106896-4"
  },
  {
    "id": "H4hbWgMHhV1",
    "name": "Mwawaza Dispensary",
    "code": "105980-7"
  },
  {
    "id": "MKNIz0YUCJS",
    "name": "Faha Dental Clinic",
    "code": "111237-4"
  },
  {
    "id": "Cnc466k1RSh",
    "name": "Chibe Dispensary",
    "code": "100774-9"
  },
  {
    "id": "iU01H2gtKIr",
    "name": "Mwamalili Dispensary",
    "code": "108584-4"
  },
  {
    "id": "FMIHtuoD1T7",
    "name": "Uhuru Bakwata Dispensary",
    "code": "100284-9"
  },
  {
    "id": "DW7AKNB76Ud",
    "name": "Kizumbi JWTZ Dispensary",
    "code": "103257-2"
  },
  {
    "id": "iwp6McglSSi",
    "name": "Chamaguha Dispensary",
    "code": "100711-1"
  },
  {
    "id": "EjzQM8iDWXi",
    "name": "Isaka Dispensary",
    "code": "101869-6"
  },
  {
    "id": "VElqRWMudnI",
    "name": "Ngaya Dispensary",
    "code": "106364-3"
  },
  {
    "id": "lTSdu05bVNh",
    "name": "Buluma Dispensary",
    "code": "110954-5"
  },
  {
    "id": "LSBwcWyQGlH",
    "name": "Ntobo B Dispensary",
    "code": "110850-5"
  },
  {
    "id": "oBVx1pJPQkI",
    "name": "Mwazimba Dispensary",
    "code": "105987-2"
  },
  {
    "id": "MFBstiwwuu1",
    "name": "KMCL Health Center",
    "code": "110351-4"
  },
  {
    "id": "beLNE4eVGVx",
    "name": "Buganzo Dispensary",
    "code": "100444-9"
  },
  {
    "id": "yCA4RIEvDuN",
    "name": "Bukwangu Dispensary",
    "code": "110851-3"
  },
  {
    "id": "ArjGACPQBbY",
    "name": "Segese Dispensary",
    "code": "107349-3"
  },
  {
    "id": "bHGDeebIdyY",
    "name": "Mhandu Dispensary",
    "code": "110266-4"
  },
  {
    "id": "fjILdYfnQ9f",
    "name": "Kashishi Dispensary",
    "code": "102434-8"
  },
  {
    "id": "npHP1F9b8vo",
    "name": "Bugarama Health Center",
    "code": "100446-4"
  },
  {
    "id": "yV6N7bGaTZk",
    "name": "Isaka KKKT Dispensary",
    "code": "101870-4"
  },
  {
    "id": "KzWpO9GnKiE",
    "name": "Mwalugulu Dispensary",
    "code": "110028-8"
  },
  {
    "id": "ccGyGKDeuIW",
    "name": "Kalagwa Dispensary",
    "code": "110049-4"
  },
  {
    "id": "UY85VdXoQxe",
    "name": "Bulige Dispensary",
    "code": "100536-2"
  },
  {
    "id": "XW2WbBzza89",
    "name": "Chela Health Center",
    "code": "100762-4"
  },
  {
    "id": "k6weLgLMMJq",
    "name": "Nundu Dispensary",
    "code": "106619-0"
  },
  {
    "id": "NglTg3rUE7L",
    "name": "Jana Dispensary",
    "code": "102073-4"
  },
  {
    "id": "qRsok3F2yHe",
    "name": "Busangi Dispensary",
    "code": "100587-5"
  },
  {
    "id": "NUglhr4WtLs",
    "name": "Itinde Dispensary",
    "code": "111583-1"
  },
  {
    "id": "EKVX3jpnDcM",
    "name": "Kakola Dispensary",
    "code": "111584-9"
  },
  {
    "id": "Tl1x22lVbqC",
    "name": "Shilela Dispensary",
    "code": "107417-8"
  },
  {
    "id": "W063otOZvKX",
    "name": "Ntobo A Dispensary",
    "code": "106607-5"
  },
  {
    "id": "iJtuClfeODF",
    "name": "Lunguya Health Center",
    "code": "103722-5"
  },
  {
    "id": "IpIisofispI",
    "name": "Mbulu Dispensary",
    "code": "104655-6"
  },
  {
    "id": "pN607A40XWx",
    "name": "Kilago Dispensary",
    "code": "102807-5"
  },
  {
    "id": "P5a4k7pBOma",
    "name": "Nyambula Dispensary",
    "code": "106713-1"
  },
  {
    "id": "u1NmQwMVmfU",
    "name": "Mwendakulima Health Centre",
    "code": "111361-2"
  },
  {
    "id": "tOmvzBiqq3Y",
    "name": "BAKWATA Majengo Dispensary",
    "code": "100232-8"
  },
  {
    "id": "Aef8meqnJrT",
    "name": "Majengo Dispensary",
    "code": "104054-2"
  },
  {
    "id": "NnFaoowdbJk",
    "name": "Matumaini Dispensary",
    "code": "111360-4"
  },
  {
    "id": "RLHD8bT391H",
    "name": "Kinaga Dispensary",
    "code": "102922-2"
  },
  {
    "id": "tUh2FNOS2x1",
    "name": "Kagongwa Dispensary",
    "code": "102172-4"
  },
  {
    "id": "SLNa5Z1NYoG",
    "name": "Tumain Dispensary",
    "code": "110138-5"
  },
  {
    "id": "Ru0tdADFxJg",
    "name": "Zongomela Dispensary",
    "code": "108427-6"
  },
  {
    "id": "hTMWNEgCh0f",
    "name": "Iyenze Dispensary",
    "code": "102041-1"
  },
  {
    "id": "orEvrXxe46A",
    "name": "Igalilimi Health Center",
    "code": "101520-5"
  },
  {
    "id": "bmlrCwLO5lE",
    "name": "Florida KMT Dispensary",
    "code": "110156-7"
  },
  {
    "id": "MqAbaTDBYeJ",
    "name": "BAKWATA B Nyasubi Dispensary",
    "code": "110129-4"
  },
  {
    "id": "EFb3m1wi91G",
    "name": "Nyakato Dispensary",
    "code": "106669-5"
  },
  {
    "id": "tOVFkSmA55G",
    "name": "Mwime Dispensary",
    "code": "106022-7"
  },
  {
    "id": "zOhz66yoAGf",
    "name": "Marie Stopes Dispensary",
    "code": "104327-2"
  },
  {
    "id": "NRFabh83CVE",
    "name": "Isagehe Dispensary",
    "code": "101866-2"
  },
  {
    "id": "eN4VLUMzouR",
    "name": "Mpera Health Center",
    "code": "105364-4"
  },
  {
    "id": "pNTQQdvtuiM",
    "name": "Igalilimi Dispensary",
    "code": "110211-0"
  },
  {
    "id": "GwxnZrcArTs",
    "name": "Menonite Nyihogo Dispensary",
    "code": "104738-0"
  },
  {
    "id": "w5xR8E2JcOa",
    "name": "Sangilwa Dispensary",
    "code": "107286-7"
  },
  {
    "id": "QJg1JJekF8i",
    "name": "Ismail Kitinga Dispensary",
    "code": "101919-9"
  },
  {
    "id": "sDVo0oYmwVR",
    "name": "Seeke Dispensary",
    "code": "107342-8"
  },
  {
    "id": "VXACtAJD3Lr",
    "name": "Dr Chunga Dispensary",
    "code": "101004-0"
  },
  {
    "id": "dEO8a8dFgJA",
    "name": "Ngogwa Dispensary",
    "code": "110123-7"
  },
  {
    "id": "AqGoFTFbzH1",
    "name": "Lowa Health Center",
    "code": "103594-8"
  },
  {
    "id": "qJYb5VFSQI2",
    "name": "Menonite Kagongwa Dispensary",
    "code": "104733-1"
  },
  {
    "id": "UDLiDsbH2uu",
    "name": "Buzwagi Mine Clinic",
    "code": "100329-2"
  },
  {
    "id": "ToPrmOHAhv0",
    "name": "Magereza Kahama Dispensary",
    "code": "103960-1"
  },
  {
    "id": "Dj9YxnWefX1",
    "name": "Community KMT Dispensary",
    "code": "110144-3"
  },
  {
    "id": "raG8CeZwhYx",
    "name": "Wazazi Maganzo Dispensary",
    "code": "108338-5"
  },
  {
    "id": "ZDzmwqvOZgG",
    "name": "Malwilo Dispensary",
    "code": "104196-1"
  },
  {
    "id": "dgLgiv6DjIQ",
    "name": "Buganika Dispensary",
    "code": "100441-5"
  },
  {
    "id": "BPV7cji5uDo",
    "name": "Mwamanota Dispensary",
    "code": "105863-5"
  },
  {
    "id": "HDCx56xciII",
    "name": "Mipa RC Dispensary",
    "code": "104958-4"
  },
  {
    "id": "G5Fno6OhNog",
    "name": "Masanga Dispensary",
    "code": "104377-7"
  },
  {
    "id": "Zd8NDN0ADJ3",
    "name": "Mondo Dispensary",
    "code": "105286-9"
  },
  {
    "id": "ztkGPkpYinW",
    "name": "Ikonda Dispensary",
    "code": "101666-6"
  },
  {
    "id": "wXecoSPQVZ3",
    "name": "Beledi Dispensary",
    "code": "100344-1"
  },
  {
    "id": "fmN7b8R0gss",
    "name": "Kisesa Dispensary",
    "code": "103089-9"
  },
  {
    "id": "D68uVBqS2Ng",
    "name": "Masusante Dispensary",
    "code": "104431-2"
  },
  {
    "id": "SRfrIOI78Hj",
    "name": "Bubinza Dispensary",
    "code": "100427-4"
  },
  {
    "id": "d3SgW3ykl6X",
    "name": "Uchunga Dispensary",
    "code": "108003-5"
  },
  {
    "id": "rxIRJzlLZji",
    "name": "Mwamashele Dispensary",
    "code": "105868-4"
  },
  {
    "id": "N1BweU405zn",
    "name": "Ukenyenge Mennonite Dispensary",
    "code": "108352-6"
  },
  {
    "id": "Bk3witAtyD1",
    "name": "Idukilo Dispensary",
    "code": "101488-5"
  },
  {
    "id": "UiW6nnbY7nn",
    "name": "Mipa Dispensary",
    "code": "104956-8"
  },
  {
    "id": "EMgYcsTViJq",
    "name": "Mhunze Bakwata Dispensary",
    "code": "104809-9"
  },
  {
    "id": "HMQokv1Px8l",
    "name": "Bubiki Dispensary",
    "code": "100424-1"
  },
  {
    "id": "KStiyzVNLva",
    "name": "Itilima Dispensary",
    "code": "101983-5"
  },
  {
    "id": "VKHTLcngZPx",
    "name": "Nyenze Dispensary",
    "code": "106844-4"
  },
  {
    "id": "f1K3ldB2cui",
    "name": "Bulekela Dispensary",
    "code": "100532-1"
  },
  {
    "id": "o3xUPUcLo6U",
    "name": "Lubaga Dispensary",
    "code": "103605-2"
  },
  {
    "id": "hdU0TgTPSwu",
    "name": "Lagana Dispensary",
    "code": "103444-6"
  },
  {
    "id": "fWRljQ1wADH",
    "name": "Ilebelebe Dispensary",
    "code": "101723-5"
  },
  {
    "id": "im1DFVxehrh",
    "name": "Magalata Dispensary",
    "code": "103894-2"
  },
  {
    "id": "qH5T1Ay46aA",
    "name": "Itongoitale Dispensary",
    "code": "101999-1"
  },
  {
    "id": "cY9w10zbQMG",
    "name": "Kinampanda Dispensary",
    "code": "102926-3"
  },
  {
    "id": "j3V8jpplaOh",
    "name": "Shagihilu Dispensary",
    "code": "107389-9"
  },
  {
    "id": "ehmxR5XpCfo",
    "name": "Seseko Dispensary",
    "code": "107380-8"
  },
  {
    "id": "kuFXncpmho8",
    "name": "Bunambiyu Health Center",
    "code": "100561-0"
  },
  {
    "id": "giYDcAbck6I",
    "name": "Somagedi Dispensary",
    "code": "107525-8"
  },
  {
    "id": "doKjOyfMZeL",
    "name": "Negezi Dispensary",
    "code": "106303-1"
  },
  {
    "id": "L0is70FCd68",
    "name": "Hindawashi Dispensary",
    "code": "101365-5"
  },
  {
    "id": "TofxbbnWpu7",
    "name": "Muguda Dispensary",
    "code": "105637-3"
  },
  {
    "id": "EiQQ2HjXzs5",
    "name": "Badi Dispensary",
    "code": "109245-1"
  },
  {
    "id": "ThLVc0sFL7F",
    "name": "Nyasamba Dispensary",
    "code": "106818-8"
  },
  {
    "id": "s80jqQXpzSv",
    "name": "Kiloleli Dispensary",
    "code": "102861-2"
  },
  {
    "id": "F658MoWMtz1",
    "name": "Mhunze Wazazi Dispensary",
    "code": "104810-7"
  },
  {
    "id": "uyrxH2E2Dbw",
    "name": "Busangwa Dispensary",
    "code": "100589-1"
  },
  {
    "id": "hO06OC5Wn9j",
    "name": "Maganzo Dispensary",
    "code": "103906-4"
  },
  {
    "id": "mJBZK0aCFdf",
    "name": "Songwa Health Center",
    "code": "107547-2"
  },
  {
    "id": "j1BNmMvO92o",
    "name": "Migunga Dispensary",
    "code": "104881-8"
  },
  {
    "id": "M882zOcMg04",
    "name": "Kishapu Health Center",
    "code": "103099-8"
  },
  {
    "id": "oUDxjYIdXrB",
    "name": "Dr. Jakaya Kikwete District Hospital",
    "code": "111779-5"
  },
  {
    "id": "fV1c7Vg0KsF",
    "name": "Seke Bugoro Dispensary",
    "code": "107352-7"
  },
  {
    "id": "QGItS4BSFpp",
    "name": "Ngofila Dispensary",
    "code": "106390-8"
  },
  {
    "id": "Mx7ZV6WjA7l",
    "name": "Ngeme Dispensary",
    "code": "106370-0"
  },
  {
    "id": "Ck4ckltcnQe",
    "name": "Bulima Dispensary",
    "code": "100538-8"
  },
  {
    "id": "JcUfosKSMM5",
    "name": "Bupigi Dispensary",
    "code": "100002-5"
  },
  {
    "id": "dS4FyIobemN",
    "name": "Kasoli Dispensary",
    "code": "102443-9"
  },
  {
    "id": "Nu7ob0h5lZf",
    "name": "Byuna Health Center",
    "code": "100667-5"
  },
  {
    "id": "Yl7TnqEoxeM",
    "name": "Lulayu Dispensary",
    "code": "103702-7"
  },
  {
    "id": "J7jrZMGYbD1",
    "name": "Banemhi Dispensary",
    "code": "100306-0"
  },
  {
    "id": "CPzxGADKYRK",
    "name": "Igegu Dispensary",
    "code": "101538-7"
  },
  {
    "id": "Y0rHS5cjuIt",
    "name": "Halawa Dispensary",
    "code": "101298-8"
  },
  {
    "id": "bTzvlQacE5h",
    "name": "Matongo Gerezani Dispensary",
    "code": "109672-6"
  },
  {
    "id": "MPkYikC05vL",
    "name": "Gambosi Dispensary",
    "code": "101179-0"
  },
  {
    "id": "DtsjhhjWlB7",
    "name": "Sapiwi Dispensary",
    "code": "107300-6"
  },
  {
    "id": "UvxknC7fN3k",
    "name": "Gasuma Dispensary",
    "code": "101185-7"
  },
  {
    "id": "udIu28qglnJ",
    "name": "Masewa Dispensary",
    "code": "104397-5"
  },
  {
    "id": "JtcMeYy1XgA",
    "name": "kilabela Dispensary",
    "code": "109221-2"
  },
  {
    "id": "HS0nWr9JscT",
    "name": "Gibeshi Dispensary",
    "code": "101211-1"
  },
  {
    "id": "XJfqPVNMuB2",
    "name": "Ihusi Dispensary",
    "code": "101628-6"
  },
  {
    "id": "hugZJgHirvU",
    "name": "Ng'alita Dispensary",
    "code": "111257-2"
  },
  {
    "id": "XMidkr8s1lT",
    "name": "Nyawa Dispensary",
    "code": "106834-5"
  },
  {
    "id": "RYHrsxEEyQh",
    "name": "Mwamlapa Dispensary",
    "code": "105891-6"
  },
  {
    "id": "XsBZB7z8neZ",
    "name": "Miswaki Dispensary",
    "code": "104992-3"
  },
  {
    "id": "lSie4A5LQgo",
    "name": "Nkololo Dispensary",
    "code": "106530-9"
  },
  {
    "id": "yPfGPep2C22",
    "name": "Songambele RC Health Center",
    "code": "107541-5"
  },
  {
    "id": "T1zHVCm4yDV",
    "name": "Sakwe Dispensary",
    "code": "107242-0"
  },
  {
    "id": "ZMduEiFroML",
    "name": "Ikungulyabashashi Dispensary",
    "code": "101688-0"
  },
  {
    "id": "oZI2q12HJLo",
    "name": "Dutwa Dispensary",
    "code": "101045-3"
  },
  {
    "id": "PsY736BflvT",
    "name": "Nyamswa Dispensary",
    "code": "106746-1"
  },
  {
    "id": "nBmxxjDjhpG",
    "name": "Nyamikoma Dispensary",
    "code": "106727-1"
  },
  {
    "id": "LE8SM9HKNOR",
    "name": "Mwasubuya Dispensary",
    "code": "105976-5"
  },
  {
    "id": "sWAOcWCvUHb",
    "name": "Mwasinasi Dispensary",
    "code": "105974-0"
  },
  {
    "id": "TQsTFqB8Ayk",
    "name": "Bupandagila SDA Dispensary",
    "code": "100000-9"
  },
  {
    "id": "lCKnLtQMf45",
    "name": "Old Maswa RC Dispensary",
    "code": "106893-1"
  },
  {
    "id": "GUIUTrca1qS",
    "name": "Kilulu Dispensary",
    "code": "109705-4"
  },
  {
    "id": "GE8dyq8ZMTV",
    "name": "Muungano Health Center",
    "code": "105737-1"
  },
  {
    "id": "erZNz0PcADk",
    "name": "Dr. Maduhu Dispensary",
    "code": "101010-7"
  },
  {
    "id": "gcPrbVWkq8Q",
    "name": "Nyaumata Dispensary",
    "code": "106833-7"
  },
  {
    "id": "kBNZiFRtrxE",
    "name": "Magereza Bariadi Dispensary",
    "code": "100328-4"
  },
  {
    "id": "HK0pzzUBkiZ",
    "name": "Ngulyati Health Center",
    "code": "106437-7"
  },
  {
    "id": "HrkS6IKzTuf",
    "name": "MUHOJA KMT-DISPENSARY",
    "code": "110913-1"
  },
  {
    "id": "Oh41F6kupZb",
    "name": "Isanga Dispensary",
    "code": "101878-7"
  },
  {
    "id": "PW2bX6IImDX",
    "name": "Ditima Dispensary",
    "code": "100984-4"
  },
  {
    "id": "weFUzUn6ksP",
    "name": "Matale Dispensary",
    "code": "104443-7"
  },
  {
    "id": "aQl314P1S0f",
    "name": "Mwanaleguma Dispensary",
    "code": "105897-3"
  },
  {
    "id": "s7tQEyXCT80",
    "name": "Bunamhala Chuoni Dispensary",
    "code": "100562-8"
  },
  {
    "id": "ScPnXNYHmxj",
    "name": "Mwakibuga Dispensary",
    "code": "105828-8"
  },
  {
    "id": "YoqfnZDfdjY",
    "name": "Nyangokolwa Dispensary",
    "code": "109673-4"
  },
  {
    "id": "Tsem3SKrzjw",
    "name": "Itinje Dispensary",
    "code": "101988-4"
  },
  {
    "id": "ryUSKs3XxgV",
    "name": "Paji Dispensary",
    "code": "106953-3"
  },
  {
    "id": "h4PJ1HnwliU",
    "name": "Mwangikulu Dispensary",
    "code": "105932-8"
  },
  {
    "id": "ClERLK51Y8Q",
    "name": "New stand Bakwata Dispensary",
    "code": "100257-5"
  },
  {
    "id": "Y9xqgM5B3PA",
    "name": "Nkoma Dispensary",
    "code": "106531-7"
  },
  {
    "id": "TVbqBcOrOiS",
    "name": "RC Mission Dispensary",
    "code": "107068-9"
  },
  {
    "id": "h7kaG15sKnU",
    "name": "Sungu Dispensary",
    "code": "107670-2"
  },
  {
    "id": "EIoEcMf649v",
    "name": "JINAMO Dispensary",
    "code": "102085-8"
  },
  {
    "id": "SBA54DjXd3s",
    "name": "Imalaseko Dispensary",
    "code": "101786-2"
  },
  {
    "id": "I5qffpu4Bwy",
    "name": "Mwabuzo Dispensary",
    "code": "105800-7"
  },
  {
    "id": "rVwNJ1OHGcL",
    "name": "Meatu District Hospital",
    "code": "104709-1"
  },
  {
    "id": "u5TWRKcehPd",
    "name": "Nyanza Dispensary",
    "code": "106794-1"
  },
  {
    "id": "Jul3V8W9wyz",
    "name": "Mwabuma Dispensary",
    "code": "105798-3"
  },
  {
    "id": "FuhQu49Pw8x",
    "name": "Mwabagimu Dispensary",
    "code": "105781-9"
  },
  {
    "id": "Yvldh7VZOGe",
    "name": "Mwamatiga Dispensary",
    "code": "109821-9"
  },
  {
    "id": "refppYMEpcI",
    "name": "Mwandoya Health Center",
    "code": "105913-8"
  },
  {
    "id": "S2flW00Mw9J",
    "name": "Mwamanongu Dispensary",
    "code": "105862-7"
  },
  {
    "id": "W4BYxCBwvCJ",
    "name": "Makao Dispensary",
    "code": "111199-6"
  },
  {
    "id": "bDvAdsbvcjQ",
    "name": "Mwabusalu Dispensary",
    "code": "105799-1"
  },
  {
    "id": "czZqd9eZSMP",
    "name": "Kabondo Dispensary",
    "code": "102142-7"
  },
  {
    "id": "flCw9dUcMIo",
    "name": "Mwanjolo Dispensary",
    "code": "105941-9"
  },
  {
    "id": "qZUAiYAjQam",
    "name": "Mwabalegi Dispensary",
    "code": "105785-0"
  },
  {
    "id": "XUcFeaa2zGX",
    "name": "Mbugayabahya Dispensary",
    "code": "104649-9"
  },
  {
    "id": "lGo1v4VaZAV",
    "name": "Mwambiti Dispensary",
    "code": "105877-5"
  },
  {
    "id": "ArlJkk2MvKr",
    "name": "Lingeka Dispensary",
    "code": "103534-4"
  },
  {
    "id": "ASaDNzbe8aB",
    "name": "Mshikamano Bakwata Dispensary",
    "code": "108879-8"
  },
  {
    "id": "rnHWAvmvgpg",
    "name": "Mwangudo Dispensary",
    "code": "105934-4"
  },
  {
    "id": "yioguWHWKRO",
    "name": "Lubiga Dispensary",
    "code": "103611-0"
  },
  {
    "id": "fBKzteibyvL",
    "name": "Semu Dispensary",
    "code": "107361-8"
  },
  {
    "id": "xRkmc2JIzQV",
    "name": "Mwakaluba Dispensary",
    "code": "109780-7"
  },
  {
    "id": "LyWgMRLxDqx",
    "name": "Butuli Dispensary",
    "code": "109329-3"
  },
  {
    "id": "IFsLTyv6DhR",
    "name": "Mbushi Dispensary",
    "code": "104661-4"
  },
  {
    "id": "vjEXSgXmjvM",
    "name": "Mwabulutagu Dispensary",
    "code": "105796-7"
  },
  {
    "id": "PPm90A1W3Ng",
    "name": "Mwandu Itinje Dispensary",
    "code": "105914-6"
  },
  {
    "id": "s8SGK9LgyXf",
    "name": "Iseng`wa Dispensary",
    "code": "101899-3"
  },
  {
    "id": "OgJqOXzBlTM",
    "name": "Mwakipopo Dispensary",
    "code": "105832-0"
  },
  {
    "id": "fg30kKr6dhY",
    "name": "Mwamanimba Dispensary",
    "code": "108878-0"
  },
  {
    "id": "jlsjjJR8GZV",
    "name": "Mwamishali Dispensary",
    "code": "105885-8"
  },
  {
    "id": "t7G9Xdlon2L",
    "name": "Ng`hoboko Dispensary",
    "code": "106378-3"
  },
  {
    "id": "ZlJOMTPLk15",
    "name": "Bulyashi Dispensary",
    "code": "100551-1"
  },
  {
    "id": "quejIMvZA54",
    "name": "Chambala Dispensary",
    "code": "100715-2"
  },
  {
    "id": "DDsmAYchCIo",
    "name": "Mwabagalu Dispensary",
    "code": "105780-1"
  },
  {
    "id": "iwzNal96SeD",
    "name": "Minyanda Dispensary",
    "code": "104949-3"
  },
  {
    "id": "X3U0Xrby6RK",
    "name": "Kisesa Dispensary",
    "code": "103090-7"
  },
  {
    "id": "XHC9cyNEDCh",
    "name": "Mwamalole Dispensary",
    "code": "105857-7"
  },
  {
    "id": "uKiVtUMVEX4",
    "name": "Bukundi Health Center",
    "code": "100521-4"
  },
  {
    "id": "Cg0dkdjcfpg",
    "name": "Mwageni Dispensary",
    "code": "105813-0"
  },
  {
    "id": "jdUdqjSGLoe",
    "name": "Mwamanoni Dispensary",
    "code": "108881-4"
  },
  {
    "id": "ZPVjJzX9feB",
    "name": "Mwaukoli Dispensary",
    "code": "109778-1"
  },
  {
    "id": "x3xnwjM2StF",
    "name": "Mwafuguji Dispensary",
    "code": "105808-0"
  },
  {
    "id": "NK0UGEoM6Zg",
    "name": "Mwashata Dispensary",
    "code": "105970-8"
  },
  {
    "id": "BbMBm54Kn8y",
    "name": "Sakasaka Dispensary",
    "code": "107237-0"
  },
  {
    "id": "SAeg2Q4mdcg",
    "name": "Longaloniga Dispensary",
    "code": "103580-7"
  },
  {
    "id": "dFqLW8t5g95",
    "name": "Nanga Dispensary",
    "code": "106169-6"
  },
  {
    "id": "qVSqfaYrx7J",
    "name": "Habiya Dispensary",
    "code": "101290-5"
  },
  {
    "id": "Ub0JH1lXXlG",
    "name": "Mwaswale Dispensary",
    "code": "105978-1"
  },
  {
    "id": "OW9FtgcI8Pe",
    "name": "Nangale Dispensary",
    "code": "106171-2"
  },
  {
    "id": "JifWGmRYn7c",
    "name": "Mahembe Dispensary",
    "code": "104015-3"
  },
  {
    "id": "EPFg4zZNesk",
    "name": "Mwanunui Dispensary",
    "code": "105944-3"
  },
  {
    "id": "ZcvXBHGK89I",
    "name": "Chinamili Dispensary",
    "code": "100820-0"
  },
  {
    "id": "j7K8cKS1yM8",
    "name": "Nkoma Health Center",
    "code": "106532-5"
  },
  {
    "id": "dPelQYFlpmz",
    "name": "Mwabuki Dispensary",
    "code": "105794-2"
  },
  {
    "id": "zP2xdBtfIoK",
    "name": "Nkuyu Dispensary",
    "code": "106554-9"
  },
  {
    "id": "YbDve0fJl1k",
    "name": "Mitobo Dispensary",
    "code": "104999-8"
  },
  {
    "id": "dDK3WIn5xLA",
    "name": "Bunamhala Mbugani Dispensary",
    "code": "109339-2"
  },
  {
    "id": "MUMJgiw0m9r",
    "name": "Zagayu Health Center",
    "code": "108400-3"
  },
  {
    "id": "wo7UHT1DUxO",
    "name": "Ikindilo Health Center",
    "code": "101648-4"
  },
  {
    "id": "wse3Q9cn1Bi",
    "name": "Migato Dispensary",
    "code": "104875-0"
  },
  {
    "id": "TBwsIXnKnPd",
    "name": "Gaswa Dispensary",
    "code": "101186-5"
  },
  {
    "id": "duUeITsFRT5",
    "name": "Sunzula Dispensary",
    "code": "107681-9"
  },
  {
    "id": "foerpKTYuWh",
    "name": "Bumera Dispensary",
    "code": "100558-6"
  },
  {
    "id": "ZtFbwCc6d5R",
    "name": "Zanzui Dispensary",
    "code": "108408-6"
  },
  {
    "id": "zzZi17ycbFg",
    "name": "Mhunze Dispensary",
    "code": "104808-1"
  },
  {
    "id": "De7KSEUZTlR",
    "name": "Luguru Dispensary",
    "code": "103656-5"
  },
  {
    "id": "cW3mTSgb5ey",
    "name": "Nyamalapa Dispensary",
    "code": "106695-0"
  },
  {
    "id": "YuxGbXNQkdH",
    "name": "Luguru UWT Dispensary",
    "code": "103657-3"
  },
  {
    "id": "g9TBG2wHoY8",
    "name": "Longalombogo Dispensary",
    "code": "109192-5"
  },
  {
    "id": "ez39mKPj71q",
    "name": "Sagata Dispensary",
    "code": "107229-7"
  },
  {
    "id": "hblCuSeV9zg",
    "name": "Mwamapalala RC Dispensary",
    "code": "105865-0"
  },
  {
    "id": "E5d44Y0h6Cg",
    "name": "Sawida Dispensary",
    "code": "107313-9"
  },
  {
    "id": "JfAQhzOUhg7",
    "name": "Kashishi Dispensary",
    "code": "102435-5"
  },
  {
    "id": "kWMDJdptPNV",
    "name": "Lagangabilili Dispensary",
    "code": "103445-3"
  },
  {
    "id": "RHDJgUjqQnr",
    "name": "Ngeme Dispensary",
    "code": "109696-5"
  },
  {
    "id": "hblF4tg2rYH",
    "name": "Luguru Wazazi Dispensary",
    "code": "108328-6"
  },
  {
    "id": "DF6jRoDVxG0",
    "name": "Nassa Health center Health Center",
    "code": "106210-8"
  },
  {
    "id": "Y2TkvcfBwEi",
    "name": "Nyaluhande Dispensary",
    "code": "106681-0"
  },
  {
    "id": "P6GipKq6nOx",
    "name": "Menonite Lamadi Dispensary",
    "code": "104736-4"
  },
  {
    "id": "g6JFX8OYMVX",
    "name": "Mungukwanza Dispensary",
    "code": "110826-5"
  },
  {
    "id": "WocfmVWiHLQ",
    "name": "Gininiga Dispensary",
    "code": "101220-2"
  },
  {
    "id": "hSJnBFrhNnw",
    "name": "Shigalla Dispensary",
    "code": "107412-9"
  },
  {
    "id": "RQ1kKxmS9Me",
    "name": "Mwamjulila Dispensary",
    "code": "105889-0"
  },
  {
    "id": "JHvntwGbsm1",
    "name": "kijirishi Dispensary",
    "code": "102757-2"
  },
  {
    "id": "mq2mGgV1Pt6",
    "name": "Nyamikoma Busega Dispensary",
    "code": "106726-3"
  },
  {
    "id": "vvpp8DuiHyt",
    "name": "Ngasamo Dispensary",
    "code": "106361-9"
  },
  {
    "id": "yFpqBEQ2RFQ",
    "name": "Mwasamba Dispensary",
    "code": "105964-1"
  },
  {
    "id": "An6XhAlx2YO",
    "name": "Badugu Dispensary",
    "code": "100218-7"
  },
  {
    "id": "lWNcvWGNpe4",
    "name": "Mwanhale Dispensary",
    "code": "105936-9"
  },
  {
    "id": "hwdvvvHZ71E",
    "name": "Igalukilo Health Center",
    "code": "101522-1"
  },
  {
    "id": "CCzpXXDm12U",
    "name": "Mwanangi Dispensary",
    "code": "105903-9"
  },
  {
    "id": "PgSq8MGNz7D",
    "name": "Bulima Dispensary",
    "code": "100539-6"
  },
  {
    "id": "CqhuS82VQ22",
    "name": "Mwamigongwa Dispensary",
    "code": "105883-3"
  },
  {
    "id": "HcgK9vbUg20",
    "name": "Mwamagigisi Dispensary",
    "code": "105848-6"
  },
  {
    "id": "aKLPLDfO8Pc",
    "name": "Ijiha Dispensary",
    "code": "101633-6"
  },
  {
    "id": "uaSVu1vKSr1",
    "name": "Bushingwamhala Dispensary",
    "code": "100600-6"
  },
  {
    "id": "SGPoXW9c4z3",
    "name": "Lutubiga Dispensary",
    "code": "103774-6"
  },
  {
    "id": "orvhFYwAlNA",
    "name": "Kalemela Dispensary",
    "code": "102237-5"
  },
  {
    "id": "eh7XO972xnW",
    "name": "Chamugasa Dispensary",
    "code": "111307-5"
  },
  {
    "id": "kMr3qIp9YMb",
    "name": "Malili Dispensary",
    "code": "104175-5"
  },
  {
    "id": "YoHjt41pyXY",
    "name": "Zebeya Dispensary",
    "code": "108410-2"
  },
  {
    "id": "YKbtz88o5RB",
    "name": "Ikulilo Dispensary",
    "code": "101680-7"
  },
  {
    "id": "axvaV4DqElF",
    "name": "Mwang`honoli Dispensary",
    "code": "105929-4"
  },
  {
    "id": "Z2KaOHHvQbA",
    "name": "Isageng`he Dispensary",
    "code": "108527-3"
  },
  {
    "id": "eXqdtNZ3mzD",
    "name": "Masela Dispensary",
    "code": "104394-2"
  },
  {
    "id": "N4RDu5gZRJM",
    "name": "Malampaka Wazazi Dispensary",
    "code": "108340-1"
  },
  {
    "id": "EJCflT3Tosa",
    "name": "Masanwa Dispensary",
    "code": "104386-8"
  },
  {
    "id": "kk7OWxKFMUI",
    "name": "Ilamata Dispensary",
    "code": "101709-4"
  },
  {
    "id": "taulcApHn5n",
    "name": "Dulungwa Dispensary",
    "code": "101036-2"
  },
  {
    "id": "Cez8vUhMlS3",
    "name": "Mwabagalu Dispensary",
    "code": "110955-2"
  },
  {
    "id": "vkTnQMFvQWD",
    "name": "Mwagala Dispensary",
    "code": "105810-6"
  },
  {
    "id": "AWRI5BtlvoY",
    "name": "Malya Dispensary",
    "code": "104198-7"
  },
  {
    "id": "OX1RPKcHTSt",
    "name": "Seng`wa Dispensary",
    "code": "107372-5"
  },
  {
    "id": "N8PaI6CJxAe",
    "name": "Isanga Dispensary",
    "code": "110953-7"
  },
  {
    "id": "H6r7x7fELFJ",
    "name": "Mpindo Dispensary",
    "code": "105375-0"
  },
  {
    "id": "fBOQAvkNjtN",
    "name": "Nguliguli Dispensary",
    "code": "106432-8"
  },
  {
    "id": "dIYz2fBr5BX",
    "name": "Sayusayu Dispensary",
    "code": "107318-8"
  },
  {
    "id": "JBZpW5EPjl5",
    "name": "Ipililo Dispensary",
    "code": "101828-2"
  },
  {
    "id": "v7ygPPBoe28",
    "name": "Shishiyu Dispensary",
    "code": "107433-5"
  },
  {
    "id": "Xdl5Av44B1H",
    "name": "Mwabomba Dispensary",
    "code": "105791-8"
  },
  {
    "id": "BQM6PUjSGZI",
    "name": "Mwabulimbu Dispensary",
    "code": "105880-9"
  },
  {
    "id": "Ykfnj2nFzbx",
    "name": "Malampaka Health Center",
    "code": "104162-3"
  },
  {
    "id": "mNDAmrUnSS9",
    "name": "Mwasayi Health Center",
    "code": "105965-8"
  },
  {
    "id": "pDSbLE9QI8S",
    "name": "Wazazi Dispensary",
    "code": "108353-4"
  },
  {
    "id": "n53iEAWqdpc",
    "name": "Bugarama Dispensary",
    "code": "100447-2"
  },
  {
    "id": "PfuSsUPUPL7",
    "name": "Sangamwalugesha Dispensary",
    "code": "107280-0"
  },
  {
    "id": "q0S62A8YU8q",
    "name": "Budekwa Dispensary",
    "code": "100431-6"
  },
  {
    "id": "ljrvxkgCMaL",
    "name": "Nyashimba Dispensary",
    "code": "106824-6"
  },
  {
    "id": "EhS7re2BwuL",
    "name": "Sulu Dispensary",
    "code": "107660-3"
  },
  {
    "id": "ZjKsJs0xdNJ",
    "name": "Kinamwigulu Dispensary",
    "code": "102930-5"
  },
  {
    "id": "XSduwHxUIaV",
    "name": "Igunya Dispensary",
    "code": "101593-2"
  },
  {
    "id": "mvnewRnkWBv",
    "name": "Dodoma Dispensary",
    "code": "100990-1"
  },
  {
    "id": "YEeGBN11WSL",
    "name": "Jija Dispensary",
    "code": "102083-3"
  },
  {
    "id": "N6vZHlNUBhM",
    "name": "Gula Dispensary",
    "code": "101263-2"
  },
  {
    "id": "waV8xMduBw1",
    "name": "Mwashegeshi Dispensary",
    "code": "105971-6"
  },
  {
    "id": "ctA022d85F7",
    "name": "Mwamanenge Dispensary",
    "code": "105859-3"
  },
  {
    "id": "LwYCjELkHUq",
    "name": "Kadoto Dispensary",
    "code": "102152-6"
  },
  {
    "id": "TzgsUUYYLRE",
    "name": "Malita Dispensary",
    "code": "104182-1"
  },
  {
    "id": "MNaiXh637EC",
    "name": "Mwamitumai Dispensary",
    "code": "105887-4"
  },
  {
    "id": "JZXl7SWUcWI",
    "name": "Senani Dispensary",
    "code": "107363-4"
  },
  {
    "id": "iAYq2vyWmyS",
    "name": "Bushashi Dispensary",
    "code": "100598-2"
  },
  {
    "id": "OqEsFl22H37",
    "name": "Shinyanga Mwenge Dispensary",
    "code": "107426-9"
  },
  {
    "id": "LOIQwOZrbTS",
    "name": "Badi Dispensary",
    "code": "105650-6"
  },
  {
    "id": "nUKW6zlg2Za",
    "name": "Mwabayanda Dispensary",
    "code": "105788-4"
  },
  {
    "id": "mXri6z1OQDk",
    "name": "Lalago Health Center",
    "code": "103453-7"
  }
]

const credentialsSource = 'josephatjulius:Jovan2013@';
const credentials = 'josephatjulius:Jovan2013';
const headers = {
    'Content-Type': 'application/json',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
}

const headersSource = {
    'Content-Type': 'application/json',
    "Authorization": 'Basic ' + new Buffer(credentialsSource).toString('base64')
}

const programsList = [
    "RwVrL1Y8RTH",
    "CT0TNl30rld",
    "Z4szHfJebFL",
    "jYsHdmTJNVh",
    "go4MncVomkQ",
    "R8APevjOH0o",
    "CAGL7sn5Ui2"
]

const subScoreDefinitions = {
  "RwVrL1Y8RTH": [
      {
          "indicatorId": "f0VAv7CxDZW.zwkm4wGMlrr",
          "indicatorDefinition": {
              "name": " D.1 Staffing Levels",
              "expression": {
                  "numerator": "#{f0VAv7CxDZW.FgI7p5jw4Ag}*1+ #{f0VAv7CxDZW.F6KGITGpuJT}*1",
                  "denominator": {
                      "expression": 2,
                      "type": "CONSTANT"
                  },
                  "factor": 100
              },
              "filter": {
                  "expression": "#{f0VAv7CxDZW.T0PFV95uBGU}",
                  "expectedValue": "Yes"
              }
            }
      },
      {
          "indicatorId": "f0VAv7CxDZW.Y1Q5K7OrSch",
          "indicatorDefinition": {
              "name": "D.2 Staff Training",
              "expression": {
                "numerator": "#{f0VAv7CxDZW.cJxQzwelko7}*1+#{f0VAv7CxDZW.q6k72Dk52mx}*1",
                "denominator": {
                  "expression": "#{f0VAv7CxDZW.KPaKQDlzL6B}*2",
                  "type": "EXPRESSION"
                },
                "factor": 100
              },
              "filter": {
                "expression": ""
              }
            }
      }
  ],
  "CT0TNl30rld": [
      {
          "indicatorId": "CR5Ht05zhWd.xc31kbvKQYA",
          "indicatorDefinition": {
              "name": "",
              "expression": {
                "numerator": "#{CR5Ht05zhWd.JBk8vRjjzc7}*1+#{CR5Ht05zhWd.Kb7eIaCihPl}*1+#{CR5Ht05zhWd.B5KlIhmyCPi}*1+#{CR5Ht05zhWd.FoPlUXq85u1}*1",
                "denominator": {
                  "expression": 4,
                  "type": "CONSTANT"
                },
                "factor": 100
              },
              "filter": {
                "expression": ""
              }
            }
      }
  ]
}
const baseUrlSource = 'http://localhost:8087/dhis/'; 
const baseUrlReceiver = 'https://dhis.hisptz.org/dev/';
const Promise = require('promise');
// dev/api/dataElements/n62iMxfXPty.json
const getDataFromEventsSource = (link, code) => new Promise(function (resolve, reject) {
    // console.log('the link', link);
    request({
            headers: headersSource,
            uri: baseUrlSource + link,
            method: 'GET'
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                asyncFunctionToSendData(data, async (data) => {
                    await sendingData(data, link.split('?')[0], code);
                });
                resolve(data);
            } else {
                if (response) {
                    console.log(response.statusCode + ":", JSON.stringify(error));
                    reject();
                } else {
                    console.log(response);
                }
            }
        })
});

async function asyncFunctionToGetDataFromSource(array, callback) {
    for (let index = 0; index < array.length; index++) {
      // for (let countOfPrograms = 0; countOfPrograms < programsList.length; countOfPrograms++) {
      //   await callback(array[index].id, array[index].code, programsList[countOfPrograms]);
      // }
      await callback(array[index].id, array[index].code);

    }
  }

  asyncFunctionToGetDataFromSource(facilities, async (facilityId, code)=> {
      if (code) {
        // console.log('facility', facilityId, code)
        await getDataFromEventsSource('api/events.json?orgUnit=' + facilityId + '&paging=false', code);
      }
  })
 console.log('All in a Queue');

async function asyncFunctionToSendData(dataToSend, callback) {
    for (let index = 0; index < dataToSend['events'].length; index++) {
        await callback(dataToSend['events'][index], dataToSend['events'][index], dataToSend['events']);
    }
}


const sendingData = (theData, theLink, code) => new Promise(function (resolve, reject) {
    if (theLink && subScoreDefinitions[theData["program"]] && subScoreDefinitions[theData["program"]].length > 0) {
        var eventData = formatObjectFromSourceToMeetDestinationObjectDefinition(theData,code);
        var newLink = 'api/events/' + eventData['event'] + '.json';
        theLink = newLink;
        console.log(newLink, eventData.program);
        
        request({
                headers: headers,
                uri: baseUrlReceiver + theLink,
                method: 'PUT',
                body: eventData,
                json: true
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body.message)
                    resolve(response);
                } else {
                    if (response) {
                        console.log(response.statusCode + ":", JSON.stringify(error));
                        reject();
                    } else {
                        console.log('response', response);
                    }
                }
            })
    }
});

function formatObjectFromSourceToMeetDestinationObjectDefinition(event, code) {
      event['orgUnit'] = code,
      event['storedBy'] = 'josephatjulius',
      event['attributeCategoryOptions'] = 'ePX5OPZ3wxl',
      event['attributeOptionCombo'] = 'uGIJ6IdkP7Q',
      event['completedBy'] = 'josepheatjulius',
      dataValues = [];
      event['dataValues'].forEach((dataValue) => {
        dataValue['storedBy'] = 'josephatjulius';
        dataValues.push(dataValue);
      });
      subScoreDefinitions[event["program"]].forEach((defns) => {
        var numeratorValue = calculateExpressionValue(defns["indicatorDefinition"]["expression"]["numerator"], dataValues);
        var denominatorValue;
        if (defns["indicatorDefinition"]["expression"]["denominator"]["type"] == "CONSTANT") {
          denominatorValue = Number(defns["indicatorDefinition"]["expression"]["denominator"]["expression"]);
        } else {
          denominatorValue = calculateExpressionValue(defns["indicatorDefinition"]["expression"]["denominator"]["expression"], dataValues);
        }
        var subScore;
        if (denominatorValue != 0) {
          subScore = parseInt((numeratorValue/denominatorValue) * Number(defns["indicatorDefinition"]["expression"]["factor"]));
        } else {
          subScore = 0;
        }
        var subScoreObj = {
          "dataElement": defns['indicatorId'].split('.')[1],
          "value": subScore
        }
        dataValues.push(subScoreObj);
      });
      event["dataValues"] = dataValues;
      var position = event['dataValues'].length - 2;
      console.log('done', JSON.stringify(event["dataValues"][position]));
      return event;
}

function calculateSubScoresAndReturnArrayOfDataValues(dataValues, programId) {
    
}

function calculateExpressionValue(expression, dataValues) {
  var originalExpression = expression;
  var currentExpression = expression;
  if (expression.indexOf('+') >= 0){
    expression.split("+").forEach((element) => {
      dataValues.forEach((dataValue) => {
        if (dataValue['dataElement'] == element.split('.')[1].split('}')[0]) {
          currentExpression = currentExpression.replace(element.split('*')[0], getDataElementValue(dataValue['value']))
        }
      })
    })
  } else {
    expression.split("+").forEach((element) => {
      dataValues.forEach((dataValue) => {
        if (dataValue['dataElement'] == element.split('.')[1].split('}')[0]) {
          currentExpression = currentExpression.replace(element.split('*')[0], getDataElementValue(dataValue['value']))
        }
      })
    })
  }

  if (originalExpression != currentExpression) {
    // console.log(currentExpression);
    return eval(formatTheExpressionBeforeEvaluating(currentExpression));
  } else {
    return 0;
  }
}

function getDataElementValue(value) {
  if (value.indexOf('[') >= 0) {
    return Number(value.split('[')[1].split(']')[0]);
  } else {
    return 0;
  }
}

function formatTheExpressionBeforeEvaluating(expression) {
  var currentExpression = expression;
  expression.split('+').forEach((subExpression) => {
    if (subExpression.split('*')[0].length > 22) {
      currentExpression = currentExpression.replace(subExpression.split('*')[0], 0);
    }
  })
  return currentExpression;
};