/*
Hurkle Durkling — Photo to Line Art (Photoshop batch script)

Converts every photo in pipeline/incoming/ into a clean black-and-white
line-art image, saved into pipeline/lineart/, ready for the Illustrator
finalize step.

Technique: the standard "pencil sketch" method —
  duplicate layer -> desaturate -> duplicate again -> invert -> set blend
  mode to Color Dodge -> Gaussian blur -> flatten -> threshold to pure
  black/white.

HOW TO RUN
  Photoshop -> File -> Scripts -> Browse... -> select this file.
  (Or place it in Presets/Scripts and it'll appear under File > Scripts.)
  Test on ONE photo first — the BLUR_RADIUS and THRESHOLD constants below
  are a starting point and will need tuning per photo style.

REQUIREMENTS
  Adjust INPUT_FOLDER / OUTPUT_FOLDER below if this script isn't run from
  its default location inside the repo.
*/

#target photoshop

var BLUR_RADIUS = 6;      // higher = softer/thicker lines. Try 3-12.
var THRESHOLD_LEVEL = 128; // 1-255. Lower = more black retained.

// Resolve repo-relative folders from this script's own location.
var scriptFile = new File($.fileName);
var repoRoot = scriptFile.parent.parent; // scripts/ -> repo root
var INPUT_FOLDER = new Folder(repoRoot + "/pipeline/incoming");
var OUTPUT_FOLDER = new Folder(repoRoot + "/pipeline/lineart");

function main() {
  if (!INPUT_FOLDER.exists) {
    alert("Input folder not found:\n" + INPUT_FOLDER.fsName);
    return;
  }
  if (!OUTPUT_FOLDER.exists) OUTPUT_FOLDER.create();

  var files = INPUT_FOLDER.getFiles(function (f) {
    if (f instanceof Folder) return false;
    var ext = f.name.split(".").pop().toLowerCase();
    return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "tif" || ext === "tiff";
  });

  if (files.length === 0) {
    alert("No photos found in:\n" + INPUT_FOLDER.fsName);
    return;
  }

  var startRulerUnits = app.preferences.rulerUnits;
  app.preferences.rulerUnits = Units.PIXELS;

  var processed = 0;
  for (var i = 0; i < files.length; i++) {
    try {
      processOne(files[i]);
      processed++;
    } catch (e) {
      alert("Failed on " + files[i].name + ":\n" + e);
    }
  }

  app.preferences.rulerUnits = startRulerUnits;
  alert("Done. Converted " + processed + " of " + files.length + " photo(s).\nOutput: " + OUTPUT_FOLDER.fsName);
}

function processOne(file) {
  var doc = app.open(file);

  if (doc.mode !== DocumentMode.RGB) {
    doc.changeMode(ChangeMode.RGB);
  }

  var base = doc.artLayers[0];
  base.name = "base";

  var sketchLayer = base.duplicate();
  sketchLayer.desaturate();

  var invertLayer = sketchLayer.duplicate();
  invertLayer.invert();
  invertLayer.blendMode = BlendMode.COLORDODGE;
  invertLayer.applyGaussianBlur(BLUR_RADIUS);

  doc.flatten();
  doc.activeLayer.applyThreshold(THRESHOLD_LEVEL);

  var outFile = new File(OUTPUT_FOLDER + "/" + stripExt(file.name) + "-lineart.png");
  var pngOpts = new PNGSaveOptions();
  pngOpts.compression = 3;
  doc.saveAs(outFile, pngOpts, true);

  doc.close(SaveOptions.DONOTSAVECHANGES);
}

function stripExt(name) {
  var parts = name.split(".");
  parts.pop();
  return parts.join(".");
}

main();
