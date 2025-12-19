#!/bin/bash

# ===========================================
# 🎬 Dom Falcone Video Watermark Tool
# ===========================================
# Fügt das Familia Falcone Logo zu Videos hinzu
# 
# Verwendung:
#   ./add-watermark.sh video.mp4
#   ./add-watermark.sh video1.mp4 video2.mp4 video3.mp4
#
# Output: 
#   video_watermarked.mp4 (im selben Ordner)
# ===========================================

# Pfad zum Wasserzeichen (Logo)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WATERMARK="$SCRIPT_DIR/../assets/images/falcone-watermark.png"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Prüfe ob FFmpeg installiert ist
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ FFmpeg ist nicht installiert!${NC}"
    echo "Installiere es mit: brew install ffmpeg"
    exit 1
fi

# Prüfe ob Wasserzeichen existiert
if [ ! -f "$WATERMARK" ]; then
    echo -e "${RED}❌ Wasserzeichen nicht gefunden: $WATERMARK${NC}"
    exit 1
fi

# Prüfe ob mindestens ein Video übergeben wurde
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}🎬 Dom Falcone Video Watermark Tool${NC}"
    echo ""
    echo "Verwendung:"
    echo "  $0 video.mp4"
    echo "  $0 video1.mp4 video2.mp4 video3.mp4"
    echo ""
    echo "Das Wasserzeichen wird zentral unten platziert."
    exit 1
fi

# Verarbeite alle übergebenen Videos
for VIDEO in "$@"; do
    # Prüfe ob Datei existiert
    if [ ! -f "$VIDEO" ]; then
        echo -e "${RED}❌ Datei nicht gefunden: $VIDEO${NC}"
        continue
    fi
    
    # Erstelle Output-Dateinamen
    DIRNAME=$(dirname "$VIDEO")
    BASENAME=$(basename "$VIDEO")
    EXTENSION="${BASENAME##*.}"
    FILENAME="${BASENAME%.*}"
    OUTPUT="$DIRNAME/${FILENAME}_watermarked.$EXTENSION"
    
    echo -e "${YELLOW}🎬 Verarbeite: $BASENAME${NC}"
    
    # FFmpeg Befehl mit Wasserzeichen
    # - overlay: Wasserzeichen zentral unten mit 1% Abstand
    # - scale: Wasserzeichen ist 12% der Videobreite
    ffmpeg -y -i "$VIDEO" -i "$WATERMARK" \
        -filter_complex "[1:v]scale=iw*0.12:-1[wm];[0:v][wm]overlay=(W-w)/2:H-h-(H*0.01)" \
        -c:a copy \
        -preset fast \
        "$OUTPUT" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Fertig: $OUTPUT${NC}"
    else
        echo -e "${RED}❌ Fehler bei: $BASENAME${NC}"
    fi
done

echo ""
echo -e "${GREEN}🎉 Alle Videos verarbeitet!${NC}"
