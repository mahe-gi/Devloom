const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processTranscript() {
  const fileStream = fs.createReadStream('/Users/mahesh/.gemini/antigravity/brain/502d16ac-3960-4a1f-b109-aeafa23f1c3d/.system_generated/logs/transcript_full.jsonl');
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let fileContents = {};
  let phase45Started = false;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      
      // Check if we reached Phase 4.5
      if (entry.type === 'USER_INPUT' && entry.content && entry.content.includes('PHASE 4.5 REWORK')) {
        phase45Started = true;
        console.log("Found Phase 4.5 start. Stopping file capture.");
        break;
      }

      if (entry.tool_calls) {
        for (const call of entry.tool_calls) {
          if (call.function === 'write_to_file' || call.function === 'default_api:write_to_file') {
            const args = call.arguments;
            if (args.TargetFile && args.CodeContent) {
              fileContents[args.TargetFile] = args.CodeContent;
            }
          }
          // Note: we'd also want to track multi_replace_file_content if used, but write_to_file is usually how new files are created.
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  console.log("Captured files:", Object.keys(fileContents).length);
  // We can write them out to a backup folder
  const backupDir = '/Users/mahesh/projects/blog/frontend/backup-phase4';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  for (const [filepath, content] of Object.entries(fileContents)) {
      if (filepath.includes('frontend/src')) {
          const basename = path.basename(filepath);
          fs.writeFileSync(`${backupDir}/${basename}`, content);
      }
  }
  
  fs.writeFileSync(`${backupDir}/files.json`, JSON.stringify(Object.keys(fileContents), null, 2));
}

processTranscript();
