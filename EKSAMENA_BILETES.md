# Eksāmena biļetes: "Datoru tīkli I un ieskats nozarē"

Šis fails ir Claude Code mācību saturs spēles "mācību" daļai. Tajā ir **visas 18 mutiskā eksāmena biļetes** ar tehnisko saturu, runas plānu un kontroljautājumiem.

## Instrukcijas Claude Code

- Saturs balstīts uz **Cisco NetAcad ITN v7** un pasniedzēja slaidiem: "Wireless LANs" (Cisco), "Things and Connections / Connecting Things 2.0" (Cisco IoT), "Mikrotik mājas virzis un RouterOS" (LU Datorikas fakultāte, 2023). Nemaini faktus. Ja kaut ko pievieno, tam jāatbilst Cisco ITN.
- **Pasniedzējs vēlas dzirdēt tehniskas lietas.** Runā jābūt konkrētiem skaitļiem, lauku nosaukumiem, standartiem, portiem, komandām un procesa soļiem. Vispārīgas frāzes ("tas ir svarīgi drošībai") nedod punktus. Spēlei jāvērtē, cik **tehnisko atslēgas faktu** spēlētājs pieminēja.
- Valoda: **latviešu**, angļu termini iekavās (Cisco jautājumi ir angliski, tāpēc abi nosaukumi ir noderīgi).
- Lietotāja prasība: **nekad nelietot garo domuzīmi (em dash)** nevienā tekstā: kodā, UI, komentāros. Lietot kolu, komatu vai parasto defisi.
- Katrai biļetei ir vienāda struktūra, lai to būtu viegli pārvērst JSON datos:
  1. `id`, `nosaukums` (precīzs no oficiālā saraksta)
  2. **Galvenā doma** (1 teikums)
  3. **Obligātie tehniskie fakti**: saraksts, ko spēle var izmantot kā "checklist" (atzīmē, ko pateica)
  4. **Detalizēts saturs**
  5. **5 minūšu runas plāns** (5 bloki pa ~1 min)
  6. **Papildjautājumi** ar atbildēm (ko pasniedzējs var pajautāt pēc runas)
  7. **Saites** uz citām biļetēm (labam noslēgumam)

### Mutiskā eksāmena formāts
Students izvelk nejaušu biļeti, runā **5 minūtes**, tad atbild uz papildjautājumiem.

### Universālā runas struktūra
| Laiks | Bloks | Saturs |
| --- | --- | --- |
| 0:00-0:30 | Ievads | Definīcija 1 teikumā + OSI slānis + kāpēc vajag |
| 0:30-2:00 | Darbība | Mehānisms soli pa solim |
| 2:00-3:30 | Tehniskās detaļas | Lauki, izmēri baitos/bitos, standarti, porti, komandas |
| 3:30-4:30 | Piemērs | Konkrēts scenārijs ar adresēm/skaitļiem |
| 4:30-5:00 | Noslēgums | Kopsavilkums + saite uz citu tēmu |

Ap 600-700 vārdu. Ja apjūc: "Šis darbojas OSI N. slānī, tātad..."

### Ieteikumi spēlei (mācību daļa)
- **Runas treniņš:** izvelk biļeti, 5 min taimeris, ekrānā runas bloki, otrs spēlētājs ķeksē "Obligātos tehniskos faktus". Rezultāts = % pieminēto faktu.
- **Fakta zibspuldze:** īsi jautājumi no "Obligātajiem faktiem" (piem., "TCP galvenes izmērs?" → 20 B).
- **Papildjautājumu režīms:** pēc runas spēle uzdod 2-3 nejaušus papildjautājumus.
- **Shēmu režīms:** sakārtot soļus pareizā secībā (rokasspiediens, DORA, DNS, iekapsulēšana, CSMA/CA, WLAN asociācija).

---

## 1. OSI, TCP/IP modeļi

**Galvenā doma:** tīkla komunikāciju sadala slāņos; katrs slānis veic vienu uzdevumu un sadarbojas ar blakus slāņiem, tāpēc dažādu ražotāju iekārtas var sadarboties.

**Obligātie tehniskie fakti:**
- OSI = 7 slāņi (atsauces modelis, ISO), TCP/IP = 4 slāņi (protokolu modelis, "Internet model")
- Visi 7 OSI slāņi pareizā secībā ar funkciju
- TCP/IP atbilstība: Lietotnes = OSI 7+6+5; Transporta = 4; Interneta = 3; Tīkla piekļuves = 2+1
- PDU: dati, segments/datagramma, pakete, kadrs, biti
- Ierīces: komutators = 2. slānis (MAC), maršrutētājs = 3. slānis (IP), centrmezgls = 1. slānis
- Protokolu piemēri katrā slānī (HTTP, TCP/UDP, IP/ICMP, Ethernet/802.11)
- 4 slāņu modeļa priekšrocības
- Standartu organizācijas: IEEE, IETF (RFC), ISO, IANA

**Detalizēts saturs:**

| Nr. | OSI slānis | Funkcija | Protokoli/piemēri | PDU | Ierīce |
| --- | --- | --- | --- | --- | --- |
| 7 | Lietotnes (Application) | Process-to-process komunikācija | HTTP, HTTPS, DNS, DHCP, FTP, SMTP, MQTT | Dati | |
| 6 | Prezentācijas (Presentation) | Formāts, kodēšana, saspiešana, šifrēšana | JPEG, GIF, MPEG, TLS | Dati | |
| 5 | Sesijas (Session) | Dialoga izveide, uzturēšana, beigšana | RPC, NetBIOS | Dati | |
| 4 | Transporta (Transport) | Segmentēšana, porti, uzticamība | TCP, UDP | Segments / datagramma | |
| 3 | Tīkla (Network) | Loģiskā adresācija, maršrutēšana | IPv4, IPv6, ICMP, OSPF | Pakete | Maršrutētājs |
| 2 | Datu posma (Data link) | MAC adreses, kadri, piekļuve videi, FCS | Ethernet (802.3), Wi-Fi (802.11) | Kadrs | Komutators, WAP |
| 1 | Fiziskais (Physical) | Biti kā signāli (elektriski, gaisma, radio) | UTP, optika, 1000BASE-T | Biti | Centrmezgls, atkārtotājs |

Iegaumēšanai (7→1): "**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing".

Cisco TCP/IP protokolu tabula:
- **Lietotnes:** DNS, DHCP, SMTP, POP3, IMAP, FTP, SFTP, TFTP, HTTP
- **Transporta:** TCP, UDP
- **Interneta:** IP (IPv4, IPv6, NAT), ziņojumi/Messaging (ICMPv4, ICMPv6), maršrutēšanas protokoli (OSPF, EIGRP, BGP)
- **Tīkla piekļuves:** adrešu atrisināšana (ARP), datu posma protokoli (Ethernet, WLAN)

Slāņu modeļa priekšrocības (Cisco, arī IoT slaidos):
1. Palīdz protokolu izstrādē (assists in protocol design).
2. Veicina konkurenci (fosters competition), jo dažādu ražotāju produkti sadarbojas.
3. Tehnoloģijas izmaiņas vienā slānī neietekmē citus (technology independence).
4. Kopīga valoda tīkla funkciju aprakstam.

Protokolu prasības: kodēšana (encoding), formatēšana un iekapsulēšana, izmērs, laiks (plūsmas kontrole, atbildes noildze, piekļuves metode), piegādes veids (unicast, multicast, broadcast).

IoT slaidi: ir arī **IoT World Forum Reference Model** un vienkāršotā IoT arhitektūra pa savienojuma līmeņiem: Device-to-Device, Device-to-Cloud, Device-to-Gateway-to-Cloud, Device-to-Gateway-to-Cloud-to-Application.

Standartu organizācijas (vendor-neutral): IEEE (802.3, 802.11), IETF (RFC dokumenti), ISO (OSI modelis), IANA/ICANN (adreses, porti, domēni), TIA/EIA (kabeļi T568A/B), ITU-T (telekomunikācijas).

**5 minūšu runas plāns:**
1. **Ievads:** tīkls = daudz protokolu kopā; lai standartizētu, komunikāciju sadala slāņos. Divi modeļi: OSI (7, ISO, atsauces) un TCP/IP (4, protokolu modelis, reālais internets). 4 priekšrocības.
2. **OSI no augšas:** katram slānim funkcija + protokols + PDU. Pateikt iegaumēšanas frāzi.
3. **TCP/IP un atbilstība:** 4 slāņi, kurš OSI slānis kur. Cisco tabula: ICMP un OSPF ir interneta slānī, ARP ir tīkla piekļuves slānī.
4. **Piemērs:** atverot https://www.lu.lv: HTTP (7) → TLS (6) → TCP ports 443 (4) → IP adrese (3) → Ethernet kadrs ar MAC (2) → biti UTP kabelī (1). Saņēmējs atver apgrieztā secībā.
5. **Noslēgums:** ierīces pa slāņiem (komutators L2, maršrutētājs L3); IoT pievieno savus modeļus; saite uz iekapsulēšanu (14).

**Papildjautājumi:**
- Kurš OSI slānis atbild par maršrutēšanu? → Tīkla (3).
- Kuri OSI slāņi veido TCP/IP lietotnes slāni? → 5, 6, 7.
- Kuri divi OSI slāņi atbilst vienam TCP/IP slānim (tīkla piekļuve)? → Fiziskais un datu posma.
- Kā sauc PDU transporta slānī? → Segments (TCP), datagramma (UDP).
- Ar ko atšķiras protokolu modelis no atsauces modeļa? → Protokolu modelis atbilst reālai protokolu kopai (TCP/IP); atsauces modelis ir vispārīgs ietvars (OSI).
- Kurā slānī strādā ARP pēc Cisco? → Tīkla piekļuves (TCP/IP).

**Saites:** 14 (iekapsulēšana), 6 (2. slānis), 8 (3. slānis), 11/12 (4. slānis).

---

## 2. Vītā pāra kabeļu datu pārraides vide

**Galvenā doma:** vītais pāris ir lētākā un izplatītākā vara LAN vide; vadus savij pret šķērsrunu, ekranē pret EMI/RFI, un maksimālais garums ir 100 m.

**Obligātie tehniskie fakti:**
- Fiziskais slānis (OSI 1), signāls = elektriski impulsi
- UTP: 4 savīti pāri (8 vadi), RJ-45, bez ekrāna; STP: folija + ekrāns katram pārim
- Maks. garums **100 m**
- Problēmas: vājināšanās (attenuation), EMI/RFI, šķērsruna (crosstalk)
- Savīšana samazina šķērsrunu; ekranēšana samazina EMI/RFI
- Kategorijas ar ātrumiem (Cat5e 1 Gbps, Cat6a 10 Gbps)
- TIA/EIA-568: T568A un T568B (atšķiras zaļais un oranžais pāris, kontakti 1, 2, 3, 6)
- Straight-through, crossover, rollover; auto-MDIX
- Joslas platums vs caurlaidspēja vs goodput vs latentums

**Detalizēts saturs:**

Fiziskā slāņa jēdzieni:
- **Joslas platums (bandwidth):** vides kapacitāte, bit/s.
- **Caurlaidspēja (throughput):** reāli izmērītais ātrums; to ietekmē trafika apjoms, trafika tips, latentums (ierīču skaits ceļā).
- **Goodput:** lietderīgie dati bez protokolu papildinformācijas.
- **Latentums (latency):** aizkave, ieskaitot laiku ierīcēs.

Vara problēmas:
- **Vājināšanās:** signāls vājinās ar attālumu, tāpēc 100 m limits.
- **EMI/RFI:** traucējumi no motoriem, luminiscences lampām, radio.
- **Šķērsruna:** viena vada magnētiskais lauks ietekmē blakus pāri. Pretlīdzeklis: savīšana (katram pārim cits vijumu skaits).

| Tips | Uzbūve | Savienotājs | Lietojums |
| --- | --- | --- | --- |
| UTP | 4 krāsaini savīti pāri, apvalks | RJ-45 | Visizplatītākais LAN |
| STP | Kopējs folijas ekrāns + ekrāns katram pārim | Ekranēts RJ-45 | Daudz traucējumu |
| Koaksiālais | Vara serde, izolācija, vara pinuma ekrāns, apvalks | BNC, N, F | Kabeļu internets, antenas |

| Kategorija | Ātrums | Piezīme |
| --- | --- | --- |
| Cat3 | 10 Mbps | Balss līnijas |
| Cat5 | 100 Mbps | |
| Cat5e | 1 Gbps | |
| Cat6 | 1 Gbps (10 Gbps līdz ~55 m) | Separators starp pāriem |
| Cat6a | 10 Gbps līdz 100 m | |
| Cat7/Cat8 | 10 / 25-40 Gbps | Ekranēti |

Ethernet standarti: 10BASE-T (10 Mbps), 100BASE-TX (100 Mbps), 1000BASE-T (1 Gbps), 10GBASE-T (10 Gbps). "BASE" = baseband, "T" = twisted pair.

| Kontakts | T568A | T568B |
| --- | --- | --- |
| 1 | balts/zaļš | balts/oranžs |
| 2 | zaļš | oranžs |
| 3 | balts/oranžs | balts/zaļš |
| 4 | zils | zils |
| 5 | balts/zils | balts/zils |
| 6 | oranžs | zaļš |
| 7 | balts/brūns | balts/brūns |
| 8 | brūns | brūns |

- **Straight-through** (A-A vai B-B): hosts → komutators, maršrutētājs → komutators.
- **Crossover** (A-B): vienādas ierīces (komutators-komutators, PC-PC, maršrutētājs-maršrutētājs) un PC → maršrutētājs.
- **Rollover:** Cisco konsoles kabelis (PC → konsoles ports).
- **Auto-MDIX:** ports pats pielāgojas kabeļa tipam.

Salīdzinājums ar optiku: varš 10 Mbps-10 Gbps, 1-100 m, zema imunitāte pret EMI/RFI, lētākais, vieglāk instalēt; optika 10 Mbps-100 Gbps, 1-100 000 m, pilnīga imunitāte, dārgāka.

**5 minūšu runas plāns:**
1. **Ievads:** fiziskais slānis pārnes bitus; 3 vides (varš, optika, bezvadu); vītais pāris = visizplatītākais LAN.
2. **Problēmas un risinājumi:** vājināšanās (100 m), EMI/RFI, šķērsruna; savīšana un ekranēšana; UTP vs STP vs koaksiālais.
3. **Kategorijas un standarti:** Cat3 līdz Cat6a ar ātrumiem, 1000BASE-T nozīme, TIA/EIA-568.
4. **Terminēšana:** T568A/B tabula (zaļais un oranžais pāris mainās), straight-through/crossover/rollover, auto-MDIX. Piemērs: PC pie komutatora = straight-through, divi komutatori bez auto-MDIX = crossover.
5. **Noslēgums:** salīdzinājums ar optiku; joslas platums vs caurlaidspēja.

**Papildjautājumi:**
- Kāpēc vadi ir savīti? → Lai samazinātu šķērsrunu (magnētiskā lauka ietekmi starp pāriem).
- Kas ir vājināšanās? → Signāla stipruma zudums, attālumam pieaugot.
- Kāds kabelis PC → konsoles ports? → Rollover.
- Kas ietekmē caurlaidspēju? → Trafika apjoms, trafika tips, latentums.
- Kas ir modulācija? → Process, kad viens vilnis maina citu vilni.

**Saites:** 3 (optika), 6 (Ethernet standarti), 7 (auto-MDIX, duplekss).

---

## 3. Optisko kabeļu datu pārraides vide

**Galvenā doma:** optiskā šķiedra pārraida bitus kā gaismas impulsus caur stikla serdi; tā ir ātrākā un tālākā vide, imūna pret EMI/RFI, bet dārgākā.

**Obligātie tehniskie fakti:**
- Gaismas impulsi, stikla serde plānāka par matu
- Uzbūve: serde (core), apvalks (cladding), buferis, Kevlar, ārējais apvalks (jacket)
- Divas šķiedras pilndupleksam (TX un RX)
- SMF: maza serde, lāzers, viens stars, maza dispersija, simtiem km, dzeltens
- MMF: lielāka serde, LED, vairāki stari, lielāka dispersija, 10 Gbps līdz 550 m, oranžs
- Dispersija = gaismas impulsa izplešanās laikā
- Savienotāji: ST, SC, LC, duplex LC
- Lietojums: uzņēmumu tīkli, FTTH, tālsatiksme, zemūdens kabeļi
- 10 Mbps-100 Gbps, līdz 100 km, pilnīga imunitāte pret EMI/RFI

**Detalizēts saturs:**

Uzbūve: serde (tīrs stikls, pa kuru iet gaisma) → apvalks (atstaro gaismu atpakaļ serdē, pilnīga iekšējā atstarošana) → buferis → Kevlar (pret stiepšanu) → ārējais apvalks.

| Īpašība | Single-mode (SMF) | Multimode (MMF) |
| --- | --- | --- |
| Serde | Ļoti maza | Lielāka |
| Gaismas avots | Lāzers (dārgs) | LED (lēts) |
| Gaismas ceļi | Viens stars | Vairāki stari dažādos leņķos |
| Dispersija | Maza | Lielāka |
| Attālums | Simtiem km | Līdz 550 m pie 10 Gbps |
| Lietojums | Tālsatiksme, telefonija, kabeļu TV | LAN, ēku iekšienē |
| Krāsa | Dzeltena | Oranža |

| Savienotājs | Pazīmes |
| --- | --- |
| ST (Straight-Tip) | Apaļš, bajonetes stiprinājums (twist-on/off), viens no pirmajiem |
| SC (Subscriber Connector) | Kvadrātveida, push-pull, SMF un MMF |
| LC (Lucent Connector) | Mazāks SC, populārs |
| Duplex Multimode LC | Divi LC kopā: sūtīšana + saņemšana |

Lietojums: (1) uzņēmumu tīkli: mugurkauls (backbone) starp ēkām; (2) FTTH (Fiber-to-the-Home); (3) tālsatiksmes tīkli (Long-Haul); (4) zemūdens kabeļi.

Kāpēc optika starp ēkām: lielāks joslas platums, lielāki attālumi vienam kabelim, ierobežota jutība pret EMI/RFI.

Drošība: lāzera gaisma ir neredzama un bīstama acīm; griežot rodas stikla šķembas.

**5 minūšu runas plāns:**
1. **Ievads:** fiziskais slānis; biti kā gaisma; ātrākā, tālākā vide.
2. **Uzbūve un darbība:** 5 slāņi, atstarošana, 2 šķiedras pilndupleksam.
3. **SMF vs MMF:** tabula, dispersija, lāzers vs LED, attālumi, krāsas.
4. **Savienotāji un lietojums:** ST, SC, LC; 4 nozares. Piemērs: divas universitātes ēkas 400 m attālumā: MMF/SMF, jo UTP limits ir 100 m.
5. **Noslēgums:** salīdzinājums ar varu (100 Gbps/100 km pret 10 Gbps/100 m), cena un prasmes; saite uz biļeti 2.

**Papildjautājumi:**
- Kāpēc MMF der tikai īsiem attālumiem? → Lielāka dispersija.
- Kāds gaismas avots ir SMF? → Lāzers.
- Kurš savienotājs ir mazāka SC versija? → LC.
- Kāpēc optikai nevajag ekrānu? → Gaismu neietekmē EMI/RFI.
- Kāpēc divas šķiedras? → Viena sūtīšanai, otra saņemšanai (pilnduplekss).

**Saites:** 2 (varš), 6 (Ethernet ātrumi).

---

## 4. Bezvadu lokālie tīkli

Avoti: Cisco "Wireless LANs" slaidi + MikroTik praktiskais darbs.

**Galvenā doma:** WLAN (IEEE 802.11, Wi-Fi) pārraida datus radioviļņos; tā ir koplietojama pusdupleksa vide ar CSMA/CA, klienti asociējas ar piekļuves punktu, un tīklu aizsargā ar autentifikāciju un šifrēšanu (WPA2/AES).

**Obligātie tehniskie fakti:**
- Klasifikācija: WPAN (Bluetooth, 802.15, līdz 100 m), WLAN (Wi-Fi, 802.11, līdz 300 m), WWAN (jūdzes)
- 802.11 standartu tabula ar frekvencēm un ātrumiem
- 2,4 GHz, 5 GHz, 60 GHz; nepārklājošie kanāli **1, 6, 11** (2,4 GHz)
- CSMA/CA soļi (RTS/CTS, backoff)
- Topoloģijas: Ad hoc, infrastruktūras režīms, tethering
- Asociācija: 3 posmi: atklāt (discover), autentificēt, asociēt
- Pasīvā (beacon) un aktīvā (probe request) AP meklēšana
- Asociācijas parametri: SSID, parole, tīkla režīms, drošības režīms, kanāls
- Drošība: WEP (RC4, CRC-32, novecojis) → WPA (TKIP, MIC) → WPA2/802.11i (AES, CCM)
- Komponenti: bezvadu NIC, WAP, bezvadu maršrutētājs (AP + komutators + maršrutētājs), antenas
- WLAN vs LAN: RF vs kabelis, CSMA/CA vs CSMA/CD

**Detalizēts saturs:**

Bezvadu tehnoloģijas (Cisco):
- **WPAN:** dažas pēdas, Bluetooth (IEEE 802.15, pārošana, līdz 100 m).
- **WLAN:** simtiem pēdu, Wi-Fi (IEEE 802.11, līdz 300 m), dati, balss, video.
- **WWAN:** jūdzes (mobilie tīkli).
- Citi: WiMAX (802.16), Zigbee (802.15.4, IoT, mazs enerģijas patēriņš).

Wi-Fi Alliance sertificē: 802.11a/b/g/n/ac/ad saderību, 802.11i drošību (WPA2, EAP), WPS (vienkārša pieslēgšana), Wi-Fi Direct, Wi-Fi Passpoint (hotspoti), Miracast (video starp ierīcēm).

802.11 standarti (pasniedzēja slaids):

| Standarts | Maks. ātrums | Frekvence | Atpakaļsaderīgs ar |
| --- | --- | --- | --- |
| 802.11 | 2 Mb/s | 2,4 GHz | |
| 802.11a | 54 Mb/s | 5 GHz | |
| 802.11b | 11 Mb/s | 2,4 GHz | |
| 802.11g | 54 Mb/s | 2,4 GHz | 802.11b |
| 802.11n | 600 Mb/s | 2,4 un 5 GHz | 802.11a/b/g |
| 802.11ac | 1,3 Gb/s (1300 Mb/s) | 5 GHz | 802.11a/n |
| 802.11ad | 7 Gb/s (7000 Mb/s) | 2,4, 5 un 60 GHz | 802.11a/b/g/n/ac |

Papildus no ITN: 802.11ax (Wi-Fi 6, High-Efficiency Wireless). Frekvenču joslas: 2,4 GHz (UHF), 5 GHz (SHF), 60 GHz (EHF). 2,4 GHz iet tālāk un caur sienām, 5 GHz ātrāks, mazāks rādiuss.

WLAN pret LAN:

| Īpašība | 802.11 WLAN | 802.3 Ethernet LAN |
| --- | --- | --- |
| Fiziskais slānis | Radio frekvence (RF) | Kabelis |
| Piekļuve videi | Sadursmju novēršana (CSMA/CA) | Sadursmju noteikšana (CSMA/CD) |
| Pieejamība | Jebkurš ar radio NIC AP zonā | Vajag kabeļa savienojumu |
| Traucējumi | Jā | Nebūtiski |
| Regulējums | Valstu iestādes papildus | IEEE standarts |

Ierobežojumi: pārklājuma zona, traucējumi (mikroviļņu krāsnis, bezvadu telefoni), drošība, koplietojama vide (pusduplekss; jo vairāk lietotāju, jo mazāk joslas katram).

Komponenti:
- **Bezvadu NIC** gala ierīcē + **infrastruktūras ierīce** (bezvadu maršrutētājs vai AP).
- **Mājas bezvadu maršrutētājs** = piekļuves punkts + Ethernet komutators + maršrutētājs.
- **Antenas:** visvirziena (omnidirectional, "rubber duck", 360°), virziena (directional), Yagi (lieliem attālumiem).

Topoloģijas:
- **Ad hoc:** ierīces savienojas tieši bez AP.
- **Infrastruktūras režīms:** klienti caur AP vai bezvadu maršrutētāju, AP pieslēgts vadu tīklam (Distribution System).
- **Tethering (personal hotspot):** ad hoc variants, telefons ar mobilajiem datiem dala internetu.

Kanāli: 2,4 GHz kanāli pārklājas; risinājums ir **nepārklājošie kanāli 1, 6 un 11**.

CSMA/CA (shēma):
1. Sagatavo kadru.
2. Klausās: vai kanāls brīvs? Ja nē, gaida nejaušu **backoff** laiku.
3. Ja brīvs, sūta **RTS** (Request to Send).
4. Gaida **CTS** (Clear to Send). Ja nav, backoff un atkārto.
5. Sūta datus. (Saņēmējs apstiprina ar ACK.)
Bezvadu ierīce nevar vienlaikus sūtīt un dzirdēt sadursmi, tāpēc sadursmes **novērš**, nevis nosaka.

Asociācija (3 posmi): **Discover AP → Authenticate → Associate.**
- **Pasīvā meklēšana:** AP sūta apraides **beacon** kadrus ar SSID, standartiem, drošības iestatījumiem.
- **Aktīvā meklēšana:** klients sūta **probe request** uz vairākiem kanāliem; vajadzīga, ja AP neapraida beacon (slēpts SSID).
- **Parametri:** SSID, parole (drošības atslēga), tīkla režīms (a/b/g/n/ac/ad, var būt jaukts), drošības režīms (WEP/WPA/WPA2), kanāls.
- **Autentifikācija:** atvērtā (open, NULL: "autentificē mani" → "jā") vai koplietotās atslēgas (shared key / PSK).

Drošība (shared key metodes):

| Metode | Šifrēšana | Integritāte | Vērtējums |
| --- | --- | --- | --- |
| WEP | RC4 | CRC-32 | Novecojis, viegli uzlaužams |
| WPA | TKIP | MIC | Pieņemams |
| WPA2 (802.11i) | AES | CCM | Drošākais (plus WPA3 jaunāks) |

WLAN izvietošana: AP virs šķēršļiem, pie griestiem pārklājuma zonas centrā, kur ir lietotāji.

MikroTik praktiskais darbs (RouterOS, Winbox):
- RouterOS = OS ar virzi, ugunsmūri, komutatoru, 802.11a/b/g/n/ac. Iekārta hAP ac2 (SOHO).
- Pieslēgšanās: seriālais konsoles vads, Ethernet, Wi-Fi; Winbox (Neighbors rāda iekārtas).
- Wireless → Security Profiles: Mode = dynamic keys, Authentication = **WPA/WPA2 PSK**, Pre-Shared Key = parole.
- Wireless → Interfaces: Mode = **ap bridge**, SSID = tīkla vārds.
- Bezvadu klients saņem IP no DHCP servera (DHCP Server → Leases).

**5 minūšu runas plāns:**
1. **Ievads:** WLAN = IEEE 802.11 (Wi-Fi), 1. un 2. slānis, radioviļņi; WPAN/WLAN/WWAN; Wi-Fi Alliance.
2. **Standarti:** tabula no 802.11 līdz 802.11ad (ātrumi, GHz, saderība); 2,4 vs 5 GHz; kanāli 1, 6, 11.
3. **Darbība:** CSMA/CA soļi ar RTS/CTS; WLAN pret LAN; topoloģijas (ad hoc, infrastruktūra, tethering).
4. **Asociācija un drošība:** beacon vs probe, discover/authenticate/associate, SSID; WEP → WPA (TKIP) → WPA2 (AES). Piemērs: MikroTik hAP ac2: ap bridge, SSID, WPA2 PSK, klients dabū IP no DHCP.
5. **Noslēgums:** komponenti (NIC, AP, mājas maršrutētājs, antenas), izvietošana; saite uz drošību (18).

**Papildjautājumi:**
- Kāda piekļuves metode ir Wi-Fi? → CSMA/CA.
- Kāpēc WLAN ir pusdupleksa? → Visi koplieto vienu radio kanālu.
- Kuri 2,4 GHz kanāli nepārklājas? → 1, 6, 11.
- Ar ko atšķiras pasīvā un aktīvā AP meklēšana? → Beacon no AP vs probe request no klienta.
- Kāda šifrēšana WPA2? → AES (CCM). WPA → TKIP, WEP → RC4.
- Kuras ierīces traucē Wi-Fi? → Mikroviļņu krāsnis, bezvadu telefoni.
- Kas ir tethering? → Telefons kā personīgais hotspots (ad hoc variants).

**Saites:** 6 (CSMA/CD salīdzinājums), 18 (drošība), 13 (DHCP).

---

## 5. Decimālā, binārā un heksadecimālā skaitīšanas sistēmas

**Galvenā doma:** dators strādā ar bitiem; IPv4 adreses un maskas lieto binārā un decimālā formā, MAC un IPv6 adreses heksadecimālā, jo 1 hex cipars = 4 biti.

**Obligātie tehniskie fakti:**
- Bāzes: 10, 2, 16; pozicionālā notācija (cipars × bāze^pozīcija)
- Okteta vērtības **128 64 32 16 8 4 2 1**
- Pārveidošana ar atņemšanas metodi un dalīšanu
- 1 hex cipars = 4 biti (nibble); A-F = 10-15
- IPv4 = 32 biti = 4 okteti, dotted-decimal; MAC = 48 biti = 12 hex; IPv6 = 128 biti = 32 hex
- Maskas vērtības: 128, 192, 224, 240, 248, 252, 254, 255
- AND operācija tīkla adreses noteikšanai

**Detalizēts saturs:**

| Sistēma | Bāze | Cipari | Lietojums tīklos |
| --- | --- | --- | --- |
| Decimālā | 10 | 0-9 | IPv4 pieraksts (dotted-decimal) |
| Binārā | 2 | 0, 1 | IPv4 adreses un maskas iekšēji, AND |
| Heksadecimālā | 16 | 0-9, A-F | MAC, IPv6, EtherType (0x0800) |

Piemēri:
- 11000000 = 128 + 64 = **192**; 10101000 = 128 + 32 + 8 = **168**
- 173 = 10101101; 232 = 11101000; 10010101 = 149
- 192.168.11.10 = 11000000.10101000.00001011.00001010
- 0xCA = 1100 1010 = 202; 168 = 1010 1000 = 0xA8; 7562 = 0x1D8A; 0xFF02 = 65282

**Atņemšanas metode (dec → bin):** salīdzina ar 128, 64, ... 1; ja skaitlis ≥ vērtība, raksta 1 un atņem, citādi 0. Piem., 168: 1 (40), 0, 1 (8), 0, 1 (0), 0, 0, 0 = 10101000.

**Dalīšanas metode:** dala ar 2 (vai 16), atlikumus nolasa no apakšas uz augšu. 13 → 1101.

Hex ↔ bin: katrs hex cipars = 4 biti. Dec → hex ērtāk caur bināro.

| Dec | Bin | Hex | | Dec | Bin | Hex |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0000 | 0 | | 8 | 1000 | 8 |
| 1 | 0001 | 1 | | 9 | 1001 | 9 |
| 2 | 0010 | 2 | | 10 | 1010 | A |
| 3 | 0011 | 3 | | 11 | 1011 | B |
| 4 | 0100 | 4 | | 12 | 1100 | C |
| 5 | 0101 | 5 | | 13 | 1101 | D |
| 6 | 0110 | 6 | | 14 | 1110 | E |
| 7 | 0111 | 7 | | 15 | 1111 | F |

AND: 192.168.10.10 AND 255.255.255.0 = 192.168.10.0 (1 AND 1 = 1, citādi 0).

**5 minūšu runas plāns:**
1. **Ievads:** dators saprot tikai bitus; cilvēkam ērtāka decimālā; tīkliem vajag visas trīs.
2. **Pozicionālā notācija:** 120, 1011₂, FF02₁₆ izrēķināti.
3. **Binārā un IPv4:** 32 biti, 4 okteti, 128-1; uz tāfeles 192 un 168 ar atņemšanas metodi; maskas vērtības; AND piemērs.
4. **Heksadecimālā:** 4 biti = 1 cipars, A-F; MAC (48 b = 12 hex, OUI) un IPv6 (128 b); 168 → A8.
5. **Noslēgums:** bez binārā nevar saprast masku un apakštīklus; saite uz 8 un 9.

**Papildjautājumi:**
- 11110000 = ? → 240.
- 255 hex = ? → FF.
- Cik bitu vienā hex ciparā? → 4.
- Kā sauc IPv4 pieraksta formātu? → Dotted-decimal.
- 0xCA binārajā? → 11001010.

**Saites:** 8 (IPv4), 9 (IPv6), 6 (MAC).

---

## 6. Ethernet protokols

**Galvenā doma:** Ethernet (IEEE 802.3) ir vadu LAN tehnoloģija 1. un 2. slānī; tā iekapsulē paketes kadros, adresē ar 48 bitu MAC adresēm un pārbauda kļūdas ar FCS.

**Obligātie tehniskie fakti:**
- IEEE 802.3 (MAC) un 802.2 (LLC), OSI 1. un 2. slānis
- Apakšslāņi: **LLC** (software, identificē L3 protokolu, saziņa ar augšējiem slāņiem) un **MAC** (hardware, iekapsulēšana, piekļuve videi)
- Kadra lauki ar izmēriem: Preambula 7 B + SFD 1 B, **Galamērķa MAC 6 B (pirmais)**, Avota MAC 6 B, Tips 2 B, Dati 46-1500 B, FCS 4 B
- Kadra izmērs **64-1518 B**; < 64 = runt (atmet)
- EtherType: 0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP
- MAC: 48 biti, OUI (24 b, IEEE) + ražotāja daļa (24 b)
- Unicast / broadcast FF-FF-FF-FF-FF-FF / multicast 01-00-5E (IPv4), 33-33 (IPv6)
- CSMA/CD (mantotie centrmezgli, pusduplekss); mūsdienās pilnduplekss
- ARP: pieprasījums = apraide, atbilde = unicast

**Detalizēts saturs:**

Datu posma slāņa pakalpojumi: ļauj augšējiem slāņiem piekļūt videi; pieņem L3 paketes un iekapsulē kadros; kontrolē kadru novietošanu vidē; veic kļūdu noteikšanu un atmet bojātos kadrus. Datu posma standartus definē IEEE, ITU, ISO, ANSI.

Apakšslāņi:
- **LLC (Logical Link Control, IEEE 802.2):** realizēts programmatūrā (draiveri); ievieto kadrā info, kurš tīkla slāņa protokols (IPv4/IPv6) tiek lietots; ļauj IPv4 un IPv6 izmantot to pašu interfeisu.
- **MAC (Media Access Control, IEEE 802.3, 802.11, 802.15):** realizēts aparatūrā (NIC); pievieno galveni un noslēgumu, adresācija, kadru novietošana vidē un noņemšana (CSMA/CD vai CSMA/CA), kļūdu pārbaude.

Piekļuve videi: **konkurences** (contention-based: CSMA/CD Ethernet ar centrmezgliem, CSMA/CA Wi-Fi) un **kontrolētā** (deterministic, Token Ring). Metode atkarīga no **topoloģijas** un **vides koplietošanas**. Pilndupleksam arbitrāža nav vajadzīga.

Topoloģijas: fiziskā (kabeļi) un loģiskā (IP adreses, datu ceļš). LAN: zvaigzne, paplašinātā zvaigzne, kopne, gredzens. WAN: punkts-punkts, hub-and-spoke, mesh.

Ethernet kadrs:

| Lauks | Izmērs | Nozīme |
| --- | --- | --- |
| Preambula + SFD | 7 B + 1 B | Sinhronizācija (neskaita kadra izmērā) |
| Galamērķa MAC | 6 B | Saņēmējs (pirmais, lai komutators uzreiz zina) |
| Avota MAC | 6 B | Sūtītājs |
| EtherType | 2 B | Augšējā slāņa protokols |
| Dati | 46-1500 B | L3 pakete (ja mazāk, papildina) |
| FCS | 4 B | CRC kļūdu pārbaude (noslēgumā/trailer) |

FCS: sūtītājs izrēķina CRC un ieliek FCS; saņēmējs izrēķina vēlreiz; ja nesakrīt, kadrs tiek atmests. NIC pārbauda FCS un minimālo kadra izmēru. Ja galamērķa MAC nav mans (un nav broadcast/multicast grupā), NIC kadru atmet.

MAC adrese: 48 biti = 6 B = 12 hex cipari (00-60-2F-3A-07-BC, 00:60:2F..., 0060.2F3A.07BC). Fiziskā adrese, iededzināta NIC (BIA).

ARP (Address Resolution Protocol):
1. Hosts zina galamērķa IPv4, bet vajag MAC. Ja galamērķis lokālajā tīklā, meklē tā MAC; ja attālā, meklē **noklusējuma vārtejas** MAC.
2. Pārbauda ARP tabulu (kešs, ieraksti noveco).
3. Sūta **ARP request** kā apraidi (FF-FF-FF-FF-FF-FF), to saņem un apstrādā visas ierīces LAN.
4. Īpašnieks atbild ar **ARP reply** (unicast).
- Komandas: `arp -a`, `show ip arp`. Statisku ierakstu var ievadīt manuāli.
- Problēmas: daudz apraižu → aizkave lielos tīklos; **ARP spoofing/poisoning** → MITM.
- IPv6 ARP vietā: **Neighbor Solicitation / Neighbor Advertisement** (ICMPv6 ND).

**5 minūšu runas plāns:**
1. **Ievads:** Ethernet = visizplatītākā LAN tehnoloģija, IEEE 802.3, 1. un 2. slānis, 10 Mbps-100 Gbps.
2. **Datu posma slānis:** pakalpojumi, LLC (802.2, software, L3 protokols) vs MAC (hardware, adresācija, piekļuve videi); CSMA/CD vēsture.
3. **Kadrs:** uzzīmēt laukus ar baitiem, 64-1518 B, EtherType vērtības, FCS/CRC.
4. **MAC adresācija un ARP:** OUI, unicast/broadcast/multicast; ARP request (broadcast) → reply (unicast); piemērs ar vārteju.
5. **Noslēgums:** Ethernet nogādā kadru līdz nākamajai ierīcei; tālāk IP; saite uz komutēšanu (7).

**Papildjautājumi:**
- Kura adrese kadrā ir pirmā? → Galamērķa MAC.
- Kas ir FCS? → 4 B CRC noslēgumā kļūdu noteikšanai.
- Ko dara LLC? → Identificē tīkla slāņa protokolu, saziņa ar augšējiem slāņiem (software).
- Ko dara MAC apakšslānis? → Kadru novietošana vidē un noņemšana, adresācija, CSMA/CD vai CSMA/CA.
- Kāda ir ARP pieprasījuma galamērķa MAC? → FFFF.FFFF.FFFF.
- 01-00-5E-... ir? → IPv4 multicast MAC.

**Saites:** 7 (komutēšana), 14 (iekapsulēšana), 18 (ARP spoofing).

---

## 7. Ethernet komutēšana (switching)

**Galvenā doma:** 2. slāņa komutators mācās MAC adreses no ienākošo kadru avota adreses un pārsūta kadrus tikai uz vajadzīgo portu pēc galamērķa MAC adreses.

**Obligātie tehniskie fakti:**
- Mācīšanās no **avota** MAC, pārsūtīšana pēc **galamērķa** MAC
- MAC tabula (CAM), novecošanās **5 minūtes**, `show mac address-table`
- Nezināma unicast, broadcast, multicast → **pārpludināšana** (flooding) visos portos, izņemot ienākošo
- Katrs ports = atsevišķs sadursmju domēns; viss komutators = viens apraides domēns
- Store-and-forward (pārbauda CRC/FCS) vs cut-through: fast-forward (tikai galamērķa MAC), fragment-free (pirmie 64 B)
- Buferēšana: portu (port-based) vs koplietojamā (shared memory, asimetriska komutācija)
- Duplekss, autonegotiation, duplex mismatch, auto-MDIX
- Runt kadri (< 64 B) tiek atmesti

**Detalizēts saturs:**

Processs katram kadram:
1. **Mācās:** ieraksta avota MAC + ienākošo portu tabulā (vai atjauno taimeri, 5 min).
2. **Pārsūta:** meklē galamērķa MAC.
   - Zināms → tikai uz to portu (filtrēšana).
   - Nezināms unicast → pārpludina.
   - Broadcast/multicast → pārpludina.

Piemērs: PC1 (port 4) sūta uz PC3, kura MAC nav tabulā → komutators iemācās PC1 MAC uz port 4 un pārpludina kadru portos 1, 2, 3.

| Metode | Gaida | Aizkave | Kļūdu pārbaude |
| --- | --- | --- | --- |
| Store-and-forward | Visu kadru, CRC | Lielākā | Jā (bojātos atmet) |
| Cut-through fast-forward | Tikai galamērķa MAC | Mazākā | Nē |
| Cut-through fragment-free | Pirmos 64 B | Vidēja | Daļēja (sadursmes notiek pirmajos 64 B) |

Store-and-forward priekšrocība: kļūdu pārbaude, netērē joslu bojātiem kadriem; obligāts, ja porti ar dažādiem ātrumiem.

Buferēšana:
- **Port-based:** rinda katram portam; viens kadrs var bloķēt visu rindu.
- **Shared memory:** kopīgs buferis, dinamiski sadalīts; vislabāk 1000BASE-T → 100BASE-T (asimetriski).

Duplekss: pilnduplekss (abos virzienos vienlaikus, nav sadursmju, nevajag arbitrāžu) vs pusduplekss (pa vienam virzienam). **Autonegotiation** saskaņo ātrumu (ātrāko kopīgo) un dupleksu. **Duplex mismatch** = viena puse full, otra half → sadursmes, lēns tīkls. **Auto-MDIX** nosaka kabeļa tipu (`mdix auto`). Divi jauni komutatori ar straight-through: auto-MDIX nostrādās, pilnduplekss, ātrākais kopīgais ātrums.

Kāpēc CSMA/CD vairs nevajag: pilndupleksie L2 komutatori.

**5 minūšu runas plāns:**
1. **Ievads:** komutators = L2 ierīce, lēmumi tikai pēc MAC; aizstāja centrmezglus.
2. **MAC tabula:** mācās no avota, pārsūta pēc galamērķa, pārpludina; 5 min; piemērs ar 4 PC.
3. **Domēni:** sadursmju domēns katram portam, apraides domēnu sadala maršrutētājs.
4. **Pārsūtīšanas metodes un buferi:** tabula; fragment-free 64 B; shared memory asimetriskai komutācijai.
5. **Noslēgums:** duplekss, autonegotiation, auto-MDIX → tāpēc mūsdienu LAN nav sadursmju; saite uz 6.

**Papildjautājumi:**
- Kuru adresi komutators ieraksta tabulā? → Avota MAC no ienākošā kadra.
- Kad komutators pārpludina? → Nezināms galamērķis vai broadcast/multicast.
- Divi cut-through piemēri? → Fast-forward, fragment-free.
- Kāda kadra daļa store-and-forward pārbaudē? → CRC noslēgumā.
- Kas ir auto-MDIX? → Automātiski nosaka Ethernet kabeļa tipu.

**Saites:** 6 (kadrs), 10 (maršrutētājs sadala apraides domēnus).

---

## 8. IPv4 protokols

**Galvenā doma:** IPv4 ir 3. slāņa protokols ar 32 bitu hierarhiskām adresēm; maska nosaka tīkla un hosta daļu, un IP ir bezsavienojuma, "best effort" un no vides neatkarīgs.

**Obligātie tehniskie fakti:**
- Tīkla slāņa 4 operācijas: adresēšana, iekapsulēšana, maršrutēšana, dekapsulēšana
- IP īpašības: connectionless, best effort, media independent
- Galvene **20 B** (līdz 60 B), lauki: Version (0100), IHL, DS (DSCP+ECN), Total Length, Identification, Flags, Fragment Offset, **TTL**, **Protocol** (1 ICMP, 6 TCP, 17 UDP), Header Checksum, Source IP, Destination IP
- 32 biti, dotted-decimal, prefikss /24 = 255.255.255.0
- Tīkla adrese = IP AND maska; tīkla, hosta, apraides adrese
- Privātās (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 → NAT
- Speciālās: loopback 127.0.0.0/8, APIPA 169.254.0.0/16
- Unicast/broadcast/multicast (224.0.0.0-239.255.255.255)
- Apakštīklošana: hosti = 2^h - 2
- Mantotās klases A, B, C, D, E → CIDR; RIR (RIPE NCC Eiropā)

**Detalizēts saturs:**

IPv4 galvene:

| Lauks | Biti | Nozīme |
| --- | --- | --- |
| Version | 4 | 0100 = IPv4 |
| IHL | 4 | Galvenes garums |
| DS (DSCP + ECN) | 8 | Prioritāte (QoS) |
| Total Length | 16 | Visa pakete |
| Identification, Flags, Fragment Offset | 32 | Fragmentācija |
| TTL | 8 | Mīnus 1 katrā maršrutētājā; 0 → atmet, ICMP Time Exceeded avotam |
| Protocol | 8 | Augšējā slāņa protokols: 1 ICMP, 6 TCP, 17 UDP |
| Header Checksum | 16 | Galvenes kļūdu pārbaude |
| Source / Destination IP | 32 + 32 | Adreses |

Adrese un maska: 192.168.10.10/24: tīkla daļa 192.168.10, hosta .10.

| Adrese | Hosta biti | /24 piemērs |
| --- | --- | --- |
| Tīkla | visi 0 | 192.168.10.0 |
| Pirmā hosta | 0...01 | 192.168.10.1 |
| Pēdējā hosta | 1...10 | 192.168.10.254 |
| Apraides | visi 1 | 192.168.10.255 |

Raides: unicast (avots vienmēr unicast), broadcast (virzītā 192.168.10.255 vai ierobežotā 255.255.255.255; maršrutētāji nepārsūta), multicast (224.0.0.0/4, piem., 224.0.0.5 OSPF).

| Tips | Diapazons | Piezīme |
| --- | --- | --- |
| Privātās | 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 | NAT uz publisko |
| Loopback | 127.0.0.0/8 | `ping 127.0.0.1` pārbauda TCP/IP steku |
| Link-local (APIPA) | 169.254.0.0/16 | Nav DHCP servera |

**NAT** (arī MikroTik: IP → Firewall → NAT, **masquerade** likums) pārveido privātās adreses uz publisko.

Klases: A 0-127 (/8), B 128-191 (/16), C 192-223 (/24), D 224-239 (multicast), E 240-255 (eksperimentiem). Tagad bezklašu (CIDR). RIR: ARIN, LACNIC, RIPE NCC, AfriNIC, APNIC.

Apakštīklošana: aizņemas hosta bitus. 192.168.1.0/24 → /26 (maska 255.255.255.192): 4 apakštīkli (.0, .64, .128, .192), katrā 2⁶ - 2 = 62 hosti. Ieguvums: mazāki apraides domēni, drošība, pārvaldība. VLSM: dažādas maskas (piem., /30 punkts-punkts).

IPv4 ierobežojumi: adrešu izsīkums, NAT traucē end-to-end savienojamību, sarežģītība → IPv6.

**5 minūšu runas plāns:**
1. **Ievads:** 3. slānis, 4 operācijas, 3 īpašības.
2. **Galvene:** 20 B, lauki ar nozīmi (TTL, Protocol 1/6/17, adreses).
3. **Adrese un maska:** 32 biti, AND uz tāfeles, tīkla/hosta/apraides adrese; unicast/broadcast/multicast.
4. **Adrešu tipi + apakštīklošana:** privātās + NAT (MikroTik masquerade), loopback, APIPA; /26 piemērs (62 hosti).
5. **Noslēgums:** 4,3 miljardi adrešu nepietika → NAT un IPv6.

**Papildjautājumi:**
- Kurš lauks norāda augšējā slāņa protokolu? → Protocol.
- Kāds lauks satur 0100? → Version.
- Kas notiek, kad TTL = 0? → Pakete atmesta, ICMP Time Exceeded avotam.
- Cik hostu /26? → 62.
- Ko nozīmē 169.254.x.x? → Nav saņemta adrese no DHCP.
- Ko pārbauda `ping 127.0.0.1`? → TCP/IP steka darbību.

**Saites:** 5 (binārā), 9 (IPv6), 10 (maršrutēšana), 13 (DHCP).

---

## 9. IPv6 protokols

**Galvenā doma:** IPv6 ar 128 bitu adresēm atrisina IPv4 izsīkumu, novērš vajadzību pēc NAT un ievieš vienkāršāku 40 B galveni un automātisku konfigurāciju (SLAAC).

**Obligātie tehniskie fakti:**
- 128 biti, 8 hekseti pa 16 bitiem, hex, atdalīti ar kolu
- Galvene fiksēti **40 B**, 8 lauki: Version (0110), Traffic Class, Flow Label, Payload Length, Next Header, **Hop Limit**, Source, Destination
- Nav galvenes kontrolsummas; maršrutētāji nefragmentē
- Saīsināšana: sākuma nulles; `::` tikai **vienreiz**
- GUA 2000::/3, LLA fe80::/10, ULA fc00::/7, loopback ::1, multicast ff00::/8; **nav broadcast**
- GUA: 48 b globālais prefikss + 16 b apakštīkla ID + 64 b interfeisa ID; /64
- RS/RA; SLAAC, SLAAC + stateless DHCPv6, stateful DHCPv6
- EUI-64 (FFFE vidū, apgriež 7. bitu); DAD
- Neighbor Discovery: NS/NA aizstāj ARP
- Pāreja: dual stack, tunelēšana, NAT64
- NAT nav vajadzīgs, jo katram pietiek publisko adrešu

**Detalizēts saturs:**

| Lauks | Biti | Nozīme |
| --- | --- | --- |
| Version | 4 | 0110 = 6 |
| Traffic Class | 8 | Kā IPv4 DS |
| Flow Label | 20 | Vienas plūsmas pakešu vienāda apstrāde |
| Payload Length | 16 | Datu garums bez galvenes |
| Next Header | 8 | Kā IPv4 Protocol |
| Hop Limit | 8 | Kā TTL |
| Source / Destination | 128 + 128 | Adreses |

Saīsināšana: 2001:0db8:0000:1111:0000:0000:0000:0200 → 2001:db8:0:1111::200.

| Tips | Prefikss | Nozīme |
| --- | --- | --- |
| GUA | 2000::/3 | Globāli maršrutējama (kā publiskā) |
| LLA | fe80::/10 | Tikai saitē, obligāta katram interfeisam; vārteja |
| ULA | fc00::/7 | Kā privātās |
| Loopback | ::1/128 | Kā 127.0.0.1 |
| Nenoteiktā | ::/128 | |
| Multicast | ff00::/8 | ff02::1 visi mezgli, ff02::2 visi maršrutētāji |
| Anycast | no unicast | Pakete uz tuvāko |

Dinamiskā konfigurācija: hosts sūta **RS** (Router Solicitation) uz ff02::2 → maršrutētājs **RA** (prefikss, garums, vārteja = maršrutētāja LLA, metode).

| Metode | GUA no | DNS no |
| --- | --- | --- |
| SLAAC | Pats no RA prefiksa | RA |
| SLAAC + stateless DHCPv6 | Pats | DHCPv6 |
| Stateful DHCPv6 | DHCPv6 servera | DHCPv6 servera |

Interfeisa ID: nejaušs (Windows) vai **EUI-64**: MAC FC:99:47:75:CE:E0 → sadala, ieliek FFFE, apgriež 7. bitu → FE99:47FF:FE75:CEE0. **DAD** pārbauda, vai adrese nav aizņemta.

ICMPv6 ND: RS, RA, **NS, NA** (adrešu atrisināšana kā ARP, DAD), Redirect.

Pāreja: **dual stack** (abi vienlaikus, Cisco ieteikums), **tunelēšana** (IPv6 iekš IPv4), **translācija** (NAT64).

**5 minūšu runas plāns:**
1. **Ievads:** IPv4 izsīkums, NAT problēmas; 128 biti = 340 undecilioni adrešu; katram publiskā adrese, NAT nevajag.
2. **Galvene:** 40 B, 8 lauki, salīdzinājums ar IPv4 (nav checksum, nav fragmentācijas maršrutētājos, Hop Limit).
3. **Pieraksts:** hekseti, 2 noteikumi ar piemēru uz tāfeles, /64.
4. **Adrešu tipi un konfigurācija:** GUA struktūra, LLA, multicast (nav broadcast); RS/RA, 3 metodes, EUI-64, DAD, NS/NA.
5. **Noslēgums:** dual stack, tunelēšana, NAT64.

**Papildjautājumi:**
- Kāpēc IPv6 nevajag NAT? → Pietiek publisko adrešu katram hostam.
- Saīsini 2001:0db8:0000:0000:0000:0000:0000:0001 → 2001:db8::1.
- Kāpēc `::` tikai vienreiz? → Citādi nav zināms, cik nulles heksetu katrs aizstāj.
- Kas aizstāj ARP? → Neighbor Solicitation un Neighbor Advertisement.
- Kas aizstāj apraidi? → Multicast (ff02::1).

**Saites:** 8 (IPv4), 5 (hex), 6 (ARP).

---

## 10. IP virzīšana (routing)

**Galvenā doma:** maršrutēšana ir labākā ceļa izvēle paketei uz citu tīklu; hosts sūta attālās paketes uz noklusējuma vārteju, maršrutētājs izvēlas ceļu pēc garākās atbilstības un mazākās metrikas.

**Obligātie tehniskie fakti:**
- 3. slānis; maršrutētājs; katrs maršrutētājs = lēciens (hop)
- Hosts: lokāls vs attāls galamērķis (pēc maskas); attāls → **noklusējuma vārteja**
- Hosta maršrutēšanas tabula: loopback, lokālā tīkla maršruts, noklusējuma maršruts; `route print`, `netstat -r`
- Maršrutētāja tabula: C (connected), L (local), S (static), O (OSPF), D (EIGRP); 0.0.0.0/0
- **Garākā prefiksa atbilstība** (longest match); starp vairākiem maršrutiem: **mazākā metrika**
- Statiskā vs dinamiskā; OSPF (atvērts, link-state), EIGRP (Cisco), BGP (starp ISP)
- `show ip route`, `ip route ...`
- Maršrutētājs sadala apraides domēnus
- ICMP: ping (echo request/reply), traceroute (TTL), Time Exceeded, Destination Unreachable

**Detalizēts saturs:**

Hosta lēmums:
- Pats sev: 127.0.0.1.
- Lokāls hosts: tas pats tīkls → sūta tieši (ARP pēc hosta MAC).
- Attāls hosts: cits tīkls → uz noklusējuma vārteju (ARP pēc vārtejas MAC).
Hostam jātur sava tabula ar loopback, lokālā tīkla un noklusējuma maršrutu.

Noklusējuma vārteja: maršrutētāja interfeiss tajā pašā tīklā. Piem.: HQ maršrutētājā Gi0/0 = 172.20.132.13 "Store LAN" → jaunajam hostam Store LAN vārteja ir 172.20.132.13.

Komutatoram `ip default-gateway` vajag, lai komutatora paša paketes nonāktu citos tīklos (attālā pārvaldība no cita tīkla).

Maršrutētāja tabula:

| Kods | Nozīme |
| --- | --- |
| C | Tieši pievienots tīkls |
| L | Paša interfeisa IP |
| S | Statiskais maršruts |
| O | OSPF |
| D | EIGRP |
| S* / 0.0.0.0/0 | Noklusējuma maršruts ("gateway of last resort") |

Garākā atbilstība: uz 172.16.0.10 atbilst /12, /18, /26 → izvēlas /26. Starp vairākiem vienāda prefiksa ceļiem: zemākā metrika.

| | Statiskā | Dinamiskā |
| --- | --- | --- |
| Konfigurācija | Manuāli | Protokols apmainās |
| Izmaiņas topoloģijā | Jālabo manuāli | Automātiski |
| Piemērota | Mazi tīkli, maršruts uz ISP | Lieli tīkli |
| Resursi | Netērē CPU/joslu | Tērē |

Statiskais: `ip route 10.1.1.0 255.255.255.0 209.165.200.226`.
Dinamiskie: atklāj attālos tīklus, uztur aktuālu info, izvēlas labāko ceļu, atrod jaunu ceļu.
- **OSPF:** atvērts standarts, saites stāvokļa (link-state), zonas (areas), metrika = cost (joslas platums).
- **EIGRP:** Cisco, metrika: joslas platums, aizkave, slodze, uzticamība.
- **BGP:** starp ISP (autonomām sistēmām).
Piemērs: R1 ar OSPF paziņo R2 par 192.168.10.0/24, R2 paziņo R1 par 10.1.1.0/24.

ICMP: ping secība: 127.0.0.1 → noklusējuma vārteja → attāls hosts. Traceroute (`tracert`): TTL = 1, 2, 3...; katrs maršrutētājs atbild ar Time Exceeded → redz katru lēcienu.

**5 minūšu runas plāns:**
1. **Ievads:** maršrutēšana = labākā ceļa izvēle, 3. slānis, lēcieni.
2. **Hosta lēmums:** lokāls vs attāls, vārteja, `route print`.
3. **Maršrutētāja tabula:** kodi, longest match piemērs, metrika.
4. **Statiskā vs dinamiskā:** OSPF, EIGRP, BGP; R1-R2 piemērs uz tāfeles.
5. **Noslēgums:** pārbaude ar ping un traceroute (ICMP, TTL); saite uz 14 (MAC mainās, IP ne).

**Papildjautājumi:**
- Kā hosts nodrošina pareizu galamērķi? → Sava tabula: loopback, lokālais tīkls, noklusējuma maršruts.
- Kuru parametru izmanto starp vairākiem maršrutiem? → Zemāko metriku.
- Ko nozīmē L kods? → Maršrutētāja interfeisa IP.
- Kā strādā traceroute? → Palielina TTL, saņem Time Exceeded.
- Kāpēc komutatoram vārteja? → Lai komutatoru varētu pārvaldīt no cita tīkla.

**Saites:** 8 (IPv4, TTL), 14 (iekapsulēšana pa lēcieniem), 17 (konfigurācija).

---

## 11. TCP protokols

**Galvenā doma:** TCP ir uzticams, uz savienojumu orientēts transporta protokols: izveido sesiju ar trīsvirzienu rokasspiedienu, numurē baitus, apstiprina, atkārto pazaudēto un regulē plūsmu.

**Obligātie tehniskie fakti:**
- 4. slānis; PDU = segments
- 4 īpašības: sesijas izveide, uzticama piegāde, piegāde pareizā secībā, plūsmas kontrole
- Galvene **20 B**, 10 lauki: Source Port 16, Destination Port 16, Sequence 32, Acknowledgment 32, Header Length 4, Reserved 6, **Control Bits 6**, Window 16, Checksum 16, Urgent 16, Options
- Karogi: URG, ACK, PSH, RST, SYN, FIN
- 3-way handshake: SYN → SYN,ACK → ACK; beigšana: FIN, ACK, FIN, ACK (4 soļi)
- ISN nejaušs (drošība)
- SACK, loga izmērs, slīdošais logs, **MSS 1460** (1500 - 20 - 20), pārslodzes kontrole
- Porti: 0-1023, 1024-49151, 49152-65535; ligzda (socket) = IP + ports
- Portu tabula (20/21, 22, 23, 25, 53, 80, 110, 143, 443)

**Detalizēts saturs:**

Transporta slāņa uzdevumi: seko sarunām, segmentē un saliek, pievieno galveni, identificē lietotnes ar portiem, multipleksē sarunas.

Rokasspiediens:
```
Klients            Serveris
  SYN (seq = ISN) →
                  ← SYN, ACK
  ACK            →
  ... dati ...
  FIN            →
                  ← ACK
                  ← FIN
  ACK            →
```

Secības numuri: ISN nejaušs; seq pieaug par nosūtīto baitu skaitu; saņēmējs saliek segmentus buferī pareizā secībā.
- **Bez SACK:** pazūd 3. un 4. no 10 → ACK 3 → sūtītājs var atkārtot 3-10.
- **Ar SACK:** ACK 3, SACK 5-10 → atkārto tikai 3. un 4.

Plūsmas kontrole:
- **Window size:** cik baitu var sūtīt bez apstiprinājuma (logs 10 000 + ACK 1461 → līdz 11 460. baitam).
- **Slīdošais logs:** apstiprina nepārtraukti (bieži katrus 2 segmentus).
- **MSS** 1460 B = Ethernet MTU 1500 - IPv4 20 - TCP 20.
- **Pārslodzes kontrole:** ja ACK neatnāk laikā, sūtītājs samazina nesūtīto baitu daudzumu pirms ACK.

Porti: labi zināmie 0-1023; reģistrētie 1024-49151 (IANA, piem., 1812 RADIUS); dinamiskie 49152-65535. Klients 49152 → serveris 80; atbildē apmainās. `netstat` rāda sesijas.

| Ports | Protokols |
| --- | --- |
| 20/21 | FTP dati/vadība |
| 22 | SSH/SFTP |
| 23 | Telnet |
| 25 | SMTP |
| 53 | DNS (TCP lieliem) |
| 80 | HTTP |
| 110 | POP3 |
| 143 | IMAP |
| 443 | HTTPS |

**5 minūšu runas plāns:**
1. **Ievads:** transporta slānis, TCP = uzticamais; 4 īpašības; kur lieto (HTTP, SSH, e-pasts).
2. **Galvene:** uzzīmēt 20 B, 10 lauki, karogi.
3. **Rokasspiediens:** SYN, SYN-ACK, ACK + 4 soļu FIN; ISN nejaušs.
4. **Uzticamība un plūsma:** seq/ack, SACK piemērs, window, MSS 1460 aprēķins, pārslodze. Piemērs: pārlūks 49152 → serveris 443.
5. **Noslēgums:** porti, ligzdas; TCP dārgāks par UDP; saite uz 12.

**Papildjautājumi:**
- Kuri karogi otrajā segmentā? → SYN un ACK.
- Kāpēc MSS 1460? → 1500 - 20 - 20.
- Ko nosaka loga izmērs? → Cik baitu var sūtīt bez ACK.
- Kāpēc ISN nejaušs? → Pret uzbrukumiem.
- Dinamisko portu diapazons? → 49152-65535.

**Saites:** 12 (UDP), 13 (protokoli), 16 (vietnes atvēršana).

---

## 12. UDP protokols

**Galvenā doma:** UDP ir vienkāršs bezsavienojuma transporta protokols ar 8 B galveni; tas neapstiprina, nekārto un neatkārto datus, tāpēc ir ātrs un piemērots reāllaika lietotnēm.

**Obligātie tehniskie fakti:**
- 4. slānis, PDU = datagramma, "best effort"
- Nav sesijas, nav ACK, nav secības, nav plūsmas kontroles, mazs overhead
- Galvene **8 B**, 4 lauki: Source Port 16, Destination Port 16, Length 16 (galvene + dati), Checksum 16
- Lietojums: VoIP, video, spēles, DNS, DHCP, SNMP, TFTP
- Porti: 53 DNS, 67/68 DHCP, 69 TFTP, 161 SNMP
- DNS pāriet uz TCP, ja atbilde > 512 B vai zonu pārsūtīšana
- TCP vs UDP salīdzinājums

**Detalizēts saturs:**

| Lietotņu veids | Piemēri | Kāpēc UDP |
| --- | --- | --- |
| Reāllaika multivide | VoIP, video, videokonferences | Novēlota pakete nav vajadzīga |
| Vienkāršs pieprasījums-atbilde | DNS, DHCP | Sesija būtu lieka |
| Uzticamība pašā lietotnē | SNMP, TFTP | Lietotne kontrolē |

Darbība: serveris klausās labi zināmajā portā (DNS 53) un apstrādā katru datagrammu atsevišķi; klients izvēlas dinamisko avota portu; atbildē porti apmainās.

| | TCP | UDP |
| --- | --- | --- |
| Savienojums | Ir (3-way) | Nav |
| Uzticamība | ACK, atkārtošana | Nav |
| Secība | Seq numuri | Nav |
| Plūsmas kontrole | Window | Nav |
| Galvene | 20 B, 10 lauki | 8 B, 4 lauki |
| PDU | Segments | Datagramma |
| Piemēri | HTTP(S), FTP, SSH, SMTP | DNS, DHCP, VoIP, TFTP, SNMP |

IoT saite: IoT ierīcēm ar mazu jaudu bieži vajag vieglus protokolus (salīdzinājumā MQTT gan strādā virs TCP).

**5 minūšu runas plāns:**
1. **Ievads:** otrs transporta protokols, "vieglais", datagrammas.
2. **Īpašības:** ko UDP nedara (4 lietas) un kāpēc tas ir priekšrocība.
3. **Galvene:** 8 B, 4 lauki; salīdzini ar TCP 20 B.
4. **Lietojums:** VoIP (labāk zaudēt kadru nekā gaidīt), DNS (53), DHCP (67/68), TFTP (69), SNMP (161); DNS → TCP virs 512 B.
5. **Noslēgums:** TCP vs UDP tabula; izvēle atkarīga no lietotnes.

**Papildjautājumi:**
- Kāpēc VoIP lieto UDP? → Atkārtoti dati pienāktu par vēlu.
- UDP galvenes izmērs? → 8 B.
- DHCP porti? → 67 serveris, 68 klients.
- Kad DNS lieto TCP? → > 512 B vai zonu pārsūtīšana.

**Saites:** 11 (TCP), 13 (DNS, DHCP), 15 (DNS).

---

## 13. Populārākie lietojumu slāņa protokoli un pielietojumi

**Galvenā doma:** lietotnes slānis ir lietotājam tuvākais; tā protokoli nosaka, kā programmas apmainās ar datiem: tīmeklis (HTTP/HTTPS), e-pasts (SMTP/POP3/IMAP), adresācija (DNS, DHCP), failu pārsūtīšana (FTP), attālā piekļuve (SSH/Telnet) un IoT (MQTT, REST).

**Obligātie tehniskie fakti:**
- TCP/IP lietotnes slānis = OSI 5+6+7
- Klients-serveris vs P2P (BitTorrent, Gnutella)
- HTTP 80 / HTTPS 443 (TLS), GET/POST/PUT
- SMTP 25 (sūta), POP3 110 (lejupielādē, dzēš), IMAP 143 (kopija paliek)
- DNS 53, DHCP 67/68 un **DORA** (DISCOVER, OFFER, REQUEST, ACK), lease
- FTP 20 (dati) un 21 (vadība), SFTP/SSH 22, Telnet 23, TFTP 69, SMB 445
- SSH šifrē, Telnet ne
- IoT: **MQTT** (publish/subscribe, M2M, viegls) un **REST** (API caur HTTP)
- Praktiski: MikroTik kā DHCP serveris, DNS serveris, NAT

**Detalizēts saturs:**

| Protokols | Transports/ports | Uzdevums |
| --- | --- | --- |
| HTTP | TCP 80 | Tīmekļa lapas un dati |
| HTTPS | TCP 443 | HTTP + TLS (autentifikācija, šifrēšana) |
| DNS | UDP/TCP 53 | Vārds → IP |
| DHCP | UDP 67/68 | Automātiska IP konfigurācija |
| SMTP | TCP 25 | E-pasta sūtīšana |
| POP3 | TCP 110 | Lejupielāde, no servera dzēš |
| IMAP | TCP 143 | Sinhronizācija, paliek serverī |
| FTP | TCP 20/21 | Failu pārsūtīšana (2 savienojumi) |
| SFTP/SSH | TCP 22 | Šifrēta pārsūtīšana / attālā pārvaldība |
| Telnet | TCP 23 | Nešifrēta attālā pārvaldība |
| TFTP | UDP 69 | Vienkārša pārsūtīšana (IOS attēli) |
| SMB | TCP 445 | Failu/printeru koplietošana |
| MQTT | TCP 1883 (8883 ar TLS) | IoT publish/subscribe |

HTTP: URL = protokols + servera vārds + ceļš. GET (pieprasa), POST (augšupielādē formu), PUT (augšupielādē resursu). Lieto arī REST API.

E-pasts: klients → SMTP (25) → savs serveris → SMTP → adresāta serveris → adresāts lejupielādē ar POP3 (viena ierīce) vai sinhronizē ar IMAP (vairākas ierīces).

DHCP DORA:
1. **DHCPDISCOVER** (apraide, klients meklē serveri)
2. **DHCPOFFER** (serveris piedāvā adresi)
3. **DHCPREQUEST** (apraide, izvēlas serveri)
4. **DHCPACK** (apstiprina)
Adrese tiek **iznomāta** (lease); dod arī masku, vārteju, DNS. DHCPv6: SOLICIT, ADVERTISE, REQUEST, REPLY.

MikroTik praktiskais darbs (konkrēti piemēri runai):
- Virzis kā interneta klients: **DHCP Client** ārējā interfeisā (IP → DHCP Client).
- **DHCP Server** iekšējam tīklam (IP → DHCP Server → Leases rāda izīrētās adreses, arī bezvadu klientiem).
- **DNS:** virzis ir DNS serveris iekšējam tīklam.
- **NAT:** IP → Firewall → NAT, **masquerade** likums. IP → Firewall → Connections rāda aktīvās plūsmas.

IoT protokoli (Cisco IoT slaidi):
- **MQTT:** M2M/IoT savienojamības protokols, ļoti viegls **publish/subscribe** transports, mazs koda apjoms, maz joslas, augsta datu integritāte un drošība attālās vietās.
- **REST (RESTful API):** atvieglo programmu mijiedarbību internetā (caur HTTP).
- Ierīcēm jālieto vieni un tie paši lietotnes slāņa protokoli.

Klients-serveris: klients pieprasa, serveris atbild. P2P: ierīces sazinās tieši, katra var būt gan klients, gan serveris (BitTorrent, Gnutella failu apmaiņai).

**5 minūšu runas plāns:**
1. **Ievads:** lietotnes slānis tuvākais lietotājam; OSI 5-7; klients-serveris vs P2P.
2. **Tīmeklis:** HTTP/HTTPS, porti, GET/POST/PUT, TLS, REST.
3. **E-pasts:** SMTP sūta, POP3 vs IMAP saņem.
4. **Infrastruktūra:** DNS (vārds → IP) un DHCP DORA ar lease; MikroTik piemērs: DHCP klients uz WAN, DHCP serveris LAN, DNS, NAT masquerade.
5. **Noslēgums:** FTP (2 porti), SSH vs Telnet; IoT: MQTT publish/subscribe; portu tabula.

**Papildjautājumi:**
- POP3 vs IMAP? → POP3 lejupielādē un dzēš, IMAP atstāj kopiju.
- DHCP ziņojumi secībā? → DISCOVER, OFFER, REQUEST, ACK.
- Kāpēc FTP 2 porti? → 21 vadībai, 20 datiem.
- Kāpēc SSH labāks par Telnet? → Šifrē visu, arī paroles.
- Kas ir MQTT? → Viegls publish/subscribe M2M protokols IoT.

**Saites:** 15 (DNS), 16 (vietnes atvēršana), 11/12 (porti).

---

## 14. Enkapsulācijas/dekapsulācijas procesi

**Galvenā doma:** sūtot datus, katrs slānis pievieno savu galveni (iekapsulēšana), saņēmējs tās noņem apgrieztā secībā (dekapsulēšana); IP adreses paliek visā ceļā, MAC adreses mainās katrā lēcienā.

**Obligātie tehniskie fakti:**
- Segmentēšana: ātrums (multipleksēšana) un efektivitāte; secības numuri (sequencing)
- PDU: dati → segments/datagramma → pakete → kadrs → biti; PDU = vispārīgais termins
- Ko pievieno katrs slānis: porti (TCP 20 B/UDP 8 B), IP (20/40 B), kadra galvene (MAC) + noslēgums (FCS)
- Sūtīšanas secība: HTTP, TCP, IP, Ethernet
- Saņemšana: Ethernet → IP → TCP → HTTP
- Loģiskā adrese (IP) 3. slānī, fiziskā (MAC) 2. slānī
- IP end-to-end, MAC hop-to-hop; attāls galamērķis → kadra galamērķis = vārtejas MAC
- Maršrutētājs dekapsulē līdz L3, samazina TTL, iekapsulē jaunā kadrā

**Detalizēts saturs:**

| Slānis | PDU | Pievieno |
| --- | --- | --- |
| Lietotnes | Dati | Lietotnes dati |
| Transporta | Segments (TCP) / datagramma (UDP) | Porti, seq (TCP 20 B, UDP 8 B) |
| Tīkla | Pakete | IP adreses (IPv4 20 B, IPv6 40 B) |
| Datu posma | Kadrs | MAC adreses galvenē + FCS noslēgumā |
| Fiziskais | Biti | Signāli vidē |

Saņēmējs katrā slānī pārbauda: vai MAC mans/FCS pareizs → vai IP mans → ports → nodod lietotnei. Pēc Ethernet noņemšanas nākamais ir **IP interneta slānī**.

Adreses:

| Adrese | Slānis | Darbība | Mainās? |
| --- | --- | --- | --- |
| IP | 3 | Avots → galamērķis (end-to-end) | Nē (ja nav NAT) |
| MAC | 2 | Interfeiss → nākamais interfeiss (hop-to-hop) | Jā, katrā maršrutētājā |

Piemērs: PC1 (192.168.10.10) → PC2 (10.1.1.10) caur R1 un R2:

| Posms | Avota MAC | Galamērķa MAC | Avota IP | Galamērķa IP |
| --- | --- | --- | --- | --- |
| PC1 → R1 | PC1 | R1 Gi0/0/0 | 192.168.10.10 | 10.1.1.10 |
| R1 → R2 | R1 Gi0/0/1 | R2 | 192.168.10.10 | 10.1.1.10 |
| R2 → PC2 | R2 LAN | PC2 | 192.168.10.10 | 10.1.1.10 |

Web serveris → PC1 citā tīklā: kadra galamērķa MAC = servera vārtejas (maršrutētāja Fa0/0) MAC.

**5 minūšu runas plāns:**
1. **Ievads:** dati ceļo "aploksnēs"; katrs slānis pievieno savu galveni.
2. **Segmentēšana:** ātrums un efektivitāte, sequencing.
3. **PDU pa slāņiem:** tabula ar baitiem; uzzīmēt shēmu.
4. **Dekapsulēšana + adreses:** apgrieztā secība; IP end-to-end, MAC hop-to-hop; PC1 → PC2 tabula.
5. **Noslēgums:** iekapsulēšana savieno visu OSI modeli; saite uz 1 un 16.

**Papildjautājumi:**
- Kas notiek ar IP paketi pirms fiziskās vides? → Tiek iekapsulēta L2 kadrā.
- Klienta steka secība web pieprasījumam? → HTTP, TCP, IP, Ethernet.
- Kura adrese mainās katrā lēcienā? → MAC.
- Vispārīgais termins datiem jebkurā slānī? → PDU.
- Kurā slānī pievieno loģisko adresi? → Tīkla.

**Saites:** 1 (modeļi), 10 (maršrutēšana), 16 (vietnes atvēršana).

---

## 15. DNS sistēma

**Galvenā doma:** DNS ir hierarhiska, izkliedēta sistēma, kas pārveido domēna vārdus (FQDN) IP adresēs; strādā ar UDP 53 un kešo atbildes.

**Obligātie tehniskie fakti:**
- Lietotnes slānis, UDP **53** (TCP 53, ja > 512 B vai zonu pārsūtīšana)
- FQDN (www.cisco.com)
- Atrisināšanas soļi; kešs (TTL)
- Hierarhija: sakne (root) → TLD (.com, .lv) → otrā līmeņa (cisco.com) → apakšdomēni (www)
- Zonas; rekursīvi vaicājumi citiem serveriem
- Ieraksti: **A** (IPv4), **AAAA** (IPv6), **NS**, **MX**
- Ziņojuma sadaļas: Question, Answer, Authority, Additional
- `nslookup`, `ipconfig /displaydns`, `ipconfig /flushdns`
- MikroTik: virzis kā DNS serveris iekšējam tīklam

**Detalizēts saturs:**

Process:
1. Lietotājs ievada FQDN.
2. Klients pārbauda DNS kešu; ja nav, sūta pieprasījumu konfigurētajam DNS serverim (saņemts no DHCP).
3. Serveris meklē savos ierakstos/kešā.
4. Ja nezina, vaicā pa hierarhiju: root → TLD → autoritatīvais serveris.
5. Atbilde ar IP; kešo (TTL).
6. Klients sazinās ar IP.

Hierarhija: root "." → .com/.org/.lv → cisco.com → www/mail/ftp. Katrs serveris atbild par savu zonu.

| Ieraksts | Nozīme |
| --- | --- |
| A | Vārds → IPv4 |
| AAAA | Vārds → IPv6 ("quad-A") |
| NS | Autoritatīvais vārdu serveris |
| MX | Pasta serveris domēnam |

Viens ziņojuma formāts visam: pieprasījumi, atbildes, kļūdas, ierakstu pārsūtīšana.

Kāpēc DNS: vārdus vieglāk atcerēties; IP var mainīties, vārds paliek.

**5 minūšu runas plāns:**
1. **Ievads:** "interneta telefongrāmata", lietotnes slānis, UDP 53.
2. **Process:** 6 soļi, kešs.
3. **Hierarhija:** koks uz tāfeles, zonas, root/TLD/autoritatīvais.
4. **Ieraksti un rīki:** A, AAAA, NS, MX; sadaļas; nslookup, ipconfig /displaydns; MikroTik kā DNS serveris LAN.
5. **Noslēgums:** UDP vs TCP; DNS = pirmais solis vietnes atvēršanā (16).

**Papildjautājumi:**
- Kurš ieraksts glabā IPv6? → AAAA.
- Kāpēc UDP? → Mazi, ātri pieprasījumi.
- Kas ir FQDN? → Pilnais domēna vārds.
- Kā redzēt DNS kešu Windows? → `ipconfig /displaydns`.
- Kas ir MX ieraksts? → Domēna pasta serveris.

**Saites:** 13, 16, 12.

---

## 16. Kādas datortīkla plūsmas notiek, atverot Tīmekļa vietni

**Galvenā doma:** atverot vietni, dators secīgi izmanto DHCP, ARP, DNS, TCP rokasspiedienu, TLS un HTTP GET; katrs papildu resurss atkārto daļu no šiem soļiem.

**Obligātie tehniskie fakti:**
- 0. DHCP (IP, maska, vārteja, DNS) DORA
- 1. ARP pēc vārtejas MAC (DNS serveris citā tīklā)
- 2. DNS vaicājums UDP 53 (A/AAAA), kešs
- 3. TCP 3-way handshake uz **443** (vai 80)
- 4. TLS rokasspiediens (sertifikāts, atslēgas)
- 5. HTTP **GET** → HTML atbilde
- 6. Pārlūks attēlo; papildu resursi (attēli, CSS, JS) → jauni GET, varbūt jauns DNS
- 7. FIN aizver
- Katrā paketē: iekapsulēšana, IP nemainās, MAC mainās katrā lēcienā; NAT mājas virzī

**Detalizēts saturs:**

| Solis | Protokols | Slānis | Kas notiek |
| --- | --- | --- | --- |
| 0 | DHCP (UDP 67/68) | 7 | DORA: IP, maska, vārteja, DNS |
| 1 | ARP | 2/3 | Vārtejas MAC (broadcast → unicast) |
| 2 | DNS (UDP 53) | 7 | www.lu.lv → IP |
| 3 | TCP | 4 | SYN, SYN-ACK, ACK uz 443 |
| 4 | TLS | 6 | Sertifikāts, šifrēšanas atslēgas |
| 5 | HTTP GET | 7 | Pieprasa index.html, serveris atbild ar HTML |
| 6 | Pārlūks | | Attēlo, ielādē papildresursus |
| 7 | TCP FIN | 4 | Savienojuma beigas |

Katra pakete ceļā: dators iekapsulē (HTTP → TCP segments → IP pakete ar servera IP → Ethernet kadrs ar vārtejas MAC); mājas virzis veic **NAT masquerade** (privātā → publiskā IP); katrs maršrutētājs dekapsulē līdz L3, izvēlas ceļu, TTL - 1, iekapsulē jaunā kadrā; serveris atbild, porti apmainās (443 → 49152).

HTTP vs HTTPS: HTTP teksts atklāti (80); HTTPS = TLS autentifikācija (sertifikāts) + šifrēšana (443).

**5 minūšu runas plāns:**
1. **Ievads:** viens klikšķis iedarbina gandrīz visu protokolu steku.
2. **Sagatavošana:** DHCP DORA, ARP pēc vārtejas MAC.
3. **DNS:** UDP 53, kešs, hierarhija, A ieraksts.
4. **Savienojums:** TCP rokasspiediens uz 443, TLS, GET, HTML; iekapsulēšana, NAT, MAC mainās/IP ne.
5. **Noslēgums:** pārlūks attēlo, papildresursi, FIN; tas ir OSI no 7 līdz 1 un atpakaļ.

**Papildjautājumi:**
- Kāpēc ARP pirms DNS? → Vajag vārtejas MAC, DNS serveris citā tīklā.
- HTTPS ports? → TCP 443.
- Kāda galamērķa MAC ir kadrā uz interneta serveri? → Vārtejas MAC.
- Ja DNS nestrādā? → Var atvērt, ievadot IP tieši.

**Saites:** 13, 15, 11, 14.

---

## 17. Cisco IOS lietošana un iekārtas konfigurēšana

**Galvenā doma:** Cisco IOS pārvalda caur CLI ar hierarhiskiem režīmiem; konfigurācija ir running-config (RAM) un startup-config (NVRAM), un to saglabā ar `copy running-config startup-config`.

**Obligātie tehniskie fakti:**
- Piekļuve: **konsole** (out-of-band, rollover, sākotnēji), **SSH** (22, šifrēts), **Telnet** (23, nešifrēts), **AUX** (modems/dial-up)
- OS: shell (saskarne starp lietotāju un kodolu), kernel (aparatūra), hardware
- Režīmi un uzvednes: `>` User EXEC, `#` Privileged EXEC, `(config)#`, `(config-line)#`, `(config-if)#`
- Pārejas: `enable`, `configure terminal`, `exit`, `end`/Ctrl+Z, `disable`
- Atmiņa: RAM (running-config, zūd), NVRAM (startup-config), Flash (IOS), ROM (bootup)
- Pamatkonfigurācija: hostname, paroles (console, vty, enable secret), `login`, `service password-encryption`, banner, SVI, `copy run start`
- Palīdzība `?`, Tab, Ctrl+Shift+6
- Sintakse: uzvedne, komanda, atslēgvārds (keyword), arguments
- Hostname noteikumi
- Setup mode, ja NVRAM nav konfigurācijas
- `show ip interface brief`, `show running-config`, `show version`

**Detalizēts saturs:**

| Režīms | Uzvedne | Kā ieiet | Piemēra komanda |
| --- | --- | --- | --- |
| User EXEC | `R1>` | Pēc pieslēgšanās | `enable`, `ping` |
| Privileged EXEC | `R1#` | `enable` | `copy running-config startup-config`, `show` |
| Global Config | `R1(config)#` | `configure terminal` | `hostname`, `interface fa0/0` |
| Line Config | `R1(config-line)#` | `line console 0` / `line vty 0 15` | `password`, `login` |
| Interface Config | `R1(config-if)#` | `interface ...` | `ip address`, `no shutdown` |

`line console 0` = konsoles līnija Nr. 0 (vienīgā), nevis Ethernet ports. `line vty 0 15` = 16 attālās līnijas.

Komutatora konfigurācija (laboratorijas uzdevums):
```
enable
configure terminal
hostname SW1
line console 0
 password <KONSOLES_PAROLE>
 login
 exit
line vty 0 15
 password <VTY_PAROLE>
 login
 transport input ssh
 exit
enable secret <ENABLE_PAROLE>
service password-encryption
banner motd #Tikai autorizetai piekluvei!#
interface vlan 1
 ip address 192.168.1.2 255.255.255.0
 no shutdown
 exit
ip default-gateway 192.168.1.1
end
copy running-config startup-config
```
- `enable secret` šifrēts un pārraksta `enable password`.
- `login` ieslēdz paroles pārbaudi līnijā.
- **SVI** (`interface vlan 1`): komutatora virtuālais pārvaldības interfeiss ar IP.
- `transport input ssh`: komunikācija šifrēta.
- Banneri pārbauda: iziet no privileged EXEC un nospiež Enter.

SSH: `ip domain-name`, `crypto key generate rsa`, `username admin secret ...`, `login local`, `transport input ssh`, `ip ssh version 2`.

Maršrutētājam: `interface g0/0/0`, `ip address`, `ipv6 address .../64`, `no shutdown` (pēc noklusējuma izslēgti), `ipv6 unicast-routing`.

Atmiņa:

| Atmiņa | Zūd? | Saturs |
| --- | --- | --- |
| RAM | Jā | running-config, ARP/maršrutēšanas tabulas |
| NVRAM | Nē | startup-config |
| Flash | Nē | IOS attēls, vlan.dat |
| ROM | Nē | Bootup instrukcijas |

- `copy running-config startup-config`: RAM → NVRAM (ielādēsies pēc restartēšanas).
- `copy startup-config running-config`: NVRAM → RAM.
- Dzēšana: `erase startup-config`, `delete flash:vlan.dat`, `reload`.
- Boot ar startup-config bez konsoles paroles → User EXEC. Bez startup-config → setup mode.

Palīdzība: `?` (komandas režīmā, iespējamie atslēgvārdi/argumenti), Tab (pabeigšana), Ctrl+Shift+6 (pārtrauc ping/traceroute), Ctrl+C.

Hostname: sākas ar burtu, bez atstarpēm, beidzas ar burtu/ciparu, tikai burti/cipari/defises, < 64 simboli.

Pārbaude: `show running-config`, `show ip interface brief` (statuss un IP), `show interfaces`, `show ip route`, `show mac address-table`, `show version`.

Salīdzinājumam: MikroTik RouterOS konfigurē ar **Winbox** GUI (System → Identity, Users; IP → DHCP Client/Server, DNS, Firewall NAT; Wireless).

**5 minūšu runas plāns:**
1. **Ievads:** IOS = Cisco OS; shell/kernel; CLI; piekļuve: konsole, SSH, Telnet, AUX.
2. **Režīmi:** 5 režīmi ar uzvednēm un pārejām.
3. **Atmiņa un faili:** RAM/NVRAM/Flash/ROM; running vs startup; copy komandas; setup mode.
4. **Pamatkonfigurācija:** iet cauri komutatora konfigurācijai (hostname, 3 paroles, login, encryption, banner, SVI, gateway, save).
5. **Noslēgums:** drošība (enable secret, SSH, transport input ssh), pārbaude ar `show ip interface brief`; salīdzinājums ar MikroTik Winbox.

**Papildjautājumi:**
- Kur glabājas startup-config? → NVRAM.
- Kura atmiņa zūd pēc restartēšanas? → RAM.
- Ko konfigurē `interface vlan 1` + IP? → SVI.
- Kura komanda ieslēdz paroli user EXEC? → `login`.
- Kāpēc router nonāk setup mode? → NVRAM nav konfigurācijas.
- Kas ir `running-config` komandā `show running-config`? → Atslēgvārds (keyword).

**Saites:** 18 (drošība), 10 (maršrutēšana), 7 (komutators).

---

## 18. Datoru tīklu drošība

**Galvenā doma:** tīkla drošība nozīmē saprast draudus, ievainojamības un uzbrukumus un aizsargāties vairākos slāņos: ugunsmūri, AAA, šifrēšana (SSH, WPA2), atjauninājumi, rezerves kopijas un pareizi konfigurētas iekārtas.

**Obligātie tehniskie fakti:**
- 4 draudu veidi: informācijas zādzība, datu zudums/manipulācija, identitātes zādzība, pakalpojuma traucēšana
- 3 ievainojamību veidi: tehnoloģiskās, konfigurācijas, drošības politikas
- 4 fiziskie draudi: aparatūras, vides, elektriskie, apkopes
- Ļaunprogrammatūra: vīruss, tārps, Trojas zirgs (atšķirības)
- Uzbrukumi: izlūkošana, piekļuve (paroles, uzticības izmantošana, portu pāradresācija, MITM), DoS/DDoS
- Aizsardzība: VPN, ASA ugunsmūris, IPS, ESA/WSA, **AAA** (Authentication, Authorization, Accounting)
- Ugunsmūri: pakešu, lietotņu, URL filtrēšana, **SPI**; DMZ; NAT
- Cisco: `security passwords min-length 8`, `login block-for 120 attempts 3 within 60`, `exec-timeout 5 0`, `transport input ssh`, `service password-encryption`, `auto secure`
- WLAN: WEP (RC4) → WPA (TKIP) → WPA2 (AES)
- ARP spoofing
- IoT drošības izaicinājumi

**Detalizēts saturs:**

Draudi: informācijas zādzība, datu zudums un manipulācija, identitātes zādzība, pakalpojuma traucēšana.

| Ievainojamība | Piemēri |
| --- | --- |
| Tehnoloģiskās | TCP/IP, OS, tīkla iekārtu vājās vietas |
| Konfigurācijas | Neaizsargāti konti, vājas paroles, nepareizi konfigurēti pakalpojumi, noklusējuma iestatījumi |
| Politikas | Nav rakstiskas politikas, nav atkopšanas plāna, nav piekļuves kontroles |

Fiziskie: aparatūras bojājumi, vide (temperatūra, mitrums), elektriskie (lēcieni, strāvas zudums), apkope (slikti kabeļi, nav rezerves daļu).

| Ļaunprogrammatūra | Izplatīšanās | Pazīme |
| --- | --- | --- |
| Vīruss | Pievienojas programmai/failam, vajag lietotāju | Inficē failus |
| Tārps | Pats, caur ievainojamību | Nav vajadzīgs saimnieks |
| Trojas zirgs | Izliekas par noderīgu programmu | Nevairojas, backdoor |

Uzbrukumi:
- **Izlūkošana:** whois, ping sweep, portu skenēšana.
- **Piekļuve:** paroļu (brute force, vārdnīca), uzticības izmantošana, portu pāradresācija, **MITM** (arī ARP spoofing).
- **DoS/DDoS:** DoS no viena avota, DDoS no daudziem (botnet).

Aizsardzība (defense-in-depth):
- **VPN:** šifrēts tunelis.
- **ASA ugunsmūris:** iekšējais trafiks iziet un atgriežas, ārējie nevar sākt savienojumus.
- **IPS:** atpazīst un aptur uzbrukumus.
- **ESA/WSA:** e-pasta un tīmekļa filtrēšana.
- **AAA:** Authentication (kas tu esi?), Authorization (ko drīksti?), Accounting (ko darīji?). Piem., RADIUS (UDP 1812).
- Ugunsmūra veidi: pakešu (IP/MAC), lietotņu (porti), URL, **SPI** (ielaiž tikai atbildes uz iekšējiem pieprasījumiem). **DMZ** publiskiem serveriem.
- Rezerves kopijas (biežums, glabāšana ārpus objekta, validācija), atjauninājumi un ielāpi, galapunktu drošība (antivīruss).

Cisco iekārtu drošība:
```
security passwords min-length 8
login block-for 120 attempts 3 within 60
line vty 0 15
 exec-timeout 5 0
 transport input ssh
service password-encryption
auto secure
```
`login block-for`: pēc 3 neveiksmēm 60 s laikā bloķē uz 120 s (pret brute force). `exec-timeout 5 0`: atslēdz neaktīvu sesiju pēc 5 min. Atslēgt neizmantotos pakalpojumus un portus.

WLAN drošība: autentifikācija + šifrēšana; WEP (RC4, CRC-32, viegli uzlaužams), WPA (TKIP, MIC), WPA2 (802.11i, AES, CCM); WPA2 Enterprise ar RADIUS; nomainīt noklusējuma SSID un paroli. MikroTik: WPA/WPA2 PSK, dynamic keys.

NAT (MikroTik masquerade) slēpj iekšējās adreses, IP → Firewall → Connections rāda aktīvās plūsmas.

IoT drošības izaicinājumi (Cisco IoT slaidi): pieaugošs ierīču skaits, netradicionālas atrašanās vietas, mainīgs savākto datu tips un apjoms, **trūkst iespēju atjaunināt** (lack of upgradeability). Privātums: metadati (dati par datiem), caurspīdīgums, datu vākšana, datu piekļuve. Cisco IoT sistēmas 6 pīlāri iekļauj kiberdrošību un fizisko drošību.

**5 minūšu runas plāns:**
1. **Ievads:** drošība aizsargā konfidencialitāti, integritāti, pieejamību; 4 draudu veidi.
2. **Ievainojamības un fiziskie draudi:** 3 + 4 veidi ar piemēriem.
3. **Ļaunprogrammatūra un uzbrukumi:** vīruss/tārps/Trojas zirgs; izlūkošana, piekļuve (MITM, ARP spoofing), DoS/DDoS.
4. **Aizsardzība:** VPN, ASA, IPS, AAA (3 A), ugunsmūru veidi, SPI, DMZ; WLAN WEP → WPA2/AES.
5. **Noslēgums:** Cisco komandas (min-length 8, login block-for, exec-timeout, SSH, auto secure); IoT izaicinājumi; drošība ir process.

**Papildjautājumi:**
- Tārps vs vīruss? → Tārps izplatās pats caur ievainojamībām, bez saimnieka.
- Ko nozīmē AAA? → Authentication, Authorization, Accounting.
- DoS vs DDoS? → Viens avots vs daudzi (botnet).
- Ko dara SPI? → Ielaiž tikai atbildes uz iekšējiem pieprasījumiem.
- Ko dara `login block-for 120 attempts 3 within 60`? → Bloķē pieteikšanos 120 s pēc 3 neveiksmēm 60 s laikā.
- Kāpēc IoT ierīces ir grūti aizsargāt? → Daudz ierīču, netradicionālas vietas, nav atjauninājumu.

**Saites:** 4 (WLAN drošība), 17 (IOS konfigurācija), 6 (ARP spoofing).

---

## Pielikums A: ātrie fakti zibspuldzes režīmam

| Jautājums | Atbilde |
| --- | --- |
| OSI slāņu skaits | 7 |
| TCP/IP slāņu skaits | 4 |
| UTP maks. garums | 100 m |
| MMF 10 Gbps attālums | 550 m |
| MAC adreses garums | 48 biti / 12 hex |
| IPv4 / IPv6 garums | 32 / 128 biti |
| Ethernet kadrs | 64-1518 B |
| FCS | 4 B |
| IPv4 galvene | 20 B (līdz 60) |
| IPv6 galvene | 40 B |
| TCP galvene | 20 B |
| UDP galvene | 8 B |
| MSS | 1460 B |
| MTU Ethernet | 1500 B |
| MAC tabulas novecošanās | 5 min |
| Fragment-free | 64 B |
| Protocol lauks | 1 ICMP, 6 TCP, 17 UDP |
| EtherType | 0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP |
| Nepārklājošie 2,4 GHz kanāli | 1, 6, 11 |
| 802.11ac / ad | 1,3 Gb/s 5 GHz / 7 Gb/s līdz 60 GHz |
| Bluetooth / Wi-Fi rādiuss (slaidi) | 100 m / 300 m |
| WPA2 šifrēšana | AES (CCM) |
| Dinamiskie porti | 49152-65535 |
| DHCP | DISCOVER, OFFER, REQUEST, ACK |
| Hosti /26 | 62 |

## Pielikums B: secību uzdevumi (drag and drop)
- OSI 7 → 1: Lietotnes, Prezentācijas, Sesijas, Transporta, Tīkla, Datu posma, Fiziskais
- Iekapsulēšana: Dati → Segments → Pakete → Kadrs → Biti
- TCP: SYN → SYN,ACK → ACK
- TCP beigas: FIN → ACK → FIN → ACK
- DHCP: DISCOVER → OFFER → REQUEST → ACK
- WLAN asociācija: Discover → Authenticate → Associate
- CSMA/CA: Sagatavo kadru → Vai kanāls brīvs? (nē: backoff) → RTS → CTS saņemts? (nē: backoff) → Dati
- DNS: sakne → TLD → otrā līmeņa → apakšdomēns
- Vietnes atvēršana: DHCP → ARP → DNS → TCP → TLS → HTTP GET → attēlo → FIN
- Ethernet kadrs: Preambula/SFD → Galamērķa MAC → Avota MAC → Tips → Dati → FCS
- WLAN drošības vēsture: WEP → WPA → WPA2
