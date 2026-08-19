/*
Hurkle Durkling — Finalize Coloring Page (Illustrator batch script)

Takes every line-art PNG in pipeline/lineart/, places it onto a branded
US Letter page (thin frame + title, matching the site's look), and
exports a print-ready PDF into products/<slug>/pdf/.

Also works for Fresco exports or any hand-drawn PNG/JPG dropped straight
into pipeline/lineart/ — Photoshop is not a hard requirement, just one
way to get there.

HOW TO RUN
  Illustrator -> File -> Scripts -> Browse... -> select this file.
  You'll be prompted for the product slug (e.g. "garden-folk-coloring-set")
  — this controls the output folder: products/<slug>/pdf/

  Source images are consumed from pipeline/lineart/ and left in place;
  delete them yourself once you've confirmed the output looks right.
*/

#target illustrator

var PAGE_WIDTH = 612;   // 8.5in at 72pt/in
var PAGE_HEIGHT = 792;  // 11in
var OUTER_MARGIN = 26;  // pt, matches the double-frame look on the site
var INNER_MARGIN = 42;
var IMAGE_MARGIN = 70;  // gap between frame and artwork
var TITLE_FONT_SIZE = 18;
var TITLE_FONT = "Georgia";

var scriptFile = new File($.fileName);
var repoRoot = scriptFile.parent.parent; // scripts/ -> repo root
var SOURCE_FOLDER = new Folder(repoRoot + "/pipeline/lineart");

function main() {
  if (!SOURCE_FOLDER.exists) {
    alert("Source folder not found:\n" + SOURCE_FOLDER.fsName);
    return;
  }

  var files = SOURCE_FOLDER.getFiles(function (f) {
    if (f instanceof Folder) return false;
    var ext = f.name.split(".").pop().toLowerCase();
    return ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "tif" || ext === "tiff";
  });

  if (files.length === 0) {
    alert("No images found in:\n" + SOURCE_FOLDER.fsName);
    return;
  }

  var slug = prompt("Product slug (matches products/<slug>/):", "");
  if (!slug) return; // cancelled

  var outFolder = new Folder(repoRoot + "/products/" + slug + "/pdf");
  if (!outFolder.exists) outFolder.create();

  var done = 0;
  for (var i = 0; i < files.length; i++) {
    try {
      finalizeOne(files[i], outFolder);
      done++;
    } catch (e) {
      alert("Failed on " + files[i].name + ":\n" + e);
    }
  }

  alert("Done. Exported " + done + " of " + files.length + " page(s).\nOutput: " + outFolder.fsName);
}

function finalizeOne(imageFile, outFolder) {
  var doc = app.documents.add(DocumentColorSpace.RGB, PAGE_WIDTH, PAGE_HEIGHT);

  drawFrame(doc);
  var title = titleFromFilename(imageFile.name);
  placeArtwork(doc, imageFile, title);
  drawTitle(doc, title);

  var outFile = new File(outFolder + "/" + slugify(title) + ".pdf");
  var pdfOpts = new PDFSaveOptions();
  pdfOpts.preserveEditability = false;
  doc.saveAs(outFile, pdfOpts);

  doc.close(SaveOptions.DONOTSAVECHANGES);
}

function drawFrame(doc) {
  var outer = doc.pathItems.roundedRectangle(
    PAGE_HEIGHT - OUTER_MARGIN, OUTER_MARGIN,
    PAGE_WIDTH - OUTER_MARGIN * 2, PAGE_HEIGHT - OUTER_MARGIN * 2,
    18, 18
  );
  styleFrameLine(outer);

  var inner = doc.pathItems.roundedRectangle(
    PAGE_HEIGHT - INNER_MARGIN, INNER_MARGIN,
    PAGE_WIDTH - INNER_MARGIN * 2, PAGE_HEIGHT - INNER_MARGIN * 2,
    12, 12
  );
  styleFrameLine(inner);
}

function styleFrameLine(pathItem) {
  pathItem.filled = false;
  pathItem.stroked = true;
  pathItem.strokeWidth = 1.5;
  var black = new RGBColor();
  black.red = 0; black.green = 0; black.blue = 0;
  pathItem.strokeColor = black;
}

function placeArtwork(doc, imageFile, title) {
  var placed = doc.placedItems.add();
  placed.file = imageFile;

  var maxWidth = PAGE_WIDTH - IMAGE_MARGIN * 2;
  var maxHeight = PAGE_HEIGHT - IMAGE_MARGIN * 2 - 40; // leave room for title
  var scale = Math.min(maxWidth / placed.width, maxHeight / placed.height) * 100;
  placed.resize(scale, scale);

  placed.position = [
    (PAGE_WIDTH - placed.width) / 2,
    PAGE_HEIGHT - IMAGE_MARGIN - ((maxHeight - placed.height) / 2)
  ];
}

function drawTitle(doc, title) {
  var textFrame = doc.textFrames.add();
  textFrame.contents = title;
  textFrame.textRange.characterAttributes.size = TITLE_FONT_SIZE;
  try {
    textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName(TITLE_FONT + "-Regular");
  } catch (e) {
    // font not installed under that PostScript name; leave default
  }
  textFrame.textRange.paragraphAttributes.justification = Justification.CENTER;

  var bounds = textFrame.geometricBounds; // [left, top, right, bottom]
  var textWidth = bounds[2] - bounds[0];
  textFrame.position = [(PAGE_WIDTH - textWidth) / 2, INNER_MARGIN + 30];
}

function titleFromFilename(name) {
  var base = name.replace(/\.[^.]+$/, "").replace(/-lineart$/i, "");
  base = base.replace(/^\d+[-_]?/, ""); // drop leading page-order number
  base = base.replace(/[-_]/g, " ");
  return base.replace(/\w\S*/g, function (w) {
    return w.charAt(0).toUpperCase() + w.substr(1).toLowerCase();
  });
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

main();
