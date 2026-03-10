const fs = require('fs');
const path = require('path');

module.exports = () => ({
  name: "Delete Session Command",
  triggers: ["delsession", "delpaired"],
  react: "🗑️",
  description: "Delete a paired session directory",
  category: "Owner",
  owner: true,

  run: async ({ m, Cypher, args }) => {
    const sessionDir = path.resolve('./Resources/Sessions');

    if (!args[0]) {
      try {
        const sessions = fs.readdirSync(sessionDir)
          .filter(file => fs.statSync(path.join(sessionDir, file)).isDirectory());

        if (sessions.length === 0) {
          return m.reply('ℹ️ No paired sessions found.');
        }

        return m.reply(`📋 Paired sessions:\n${sessions.join('\n')}\n\nUsage: .delsession 2547xxxxxx`);
      } catch (error) {
        console.error('Error reading sessions directory:', error);
        return m.reply('❌ Failed to list sessions. Check console for details.');
      }
    }

    const sessionNumber = args[0].trim();
    const sessionPath = path.join(sessionDir, sessionNumber);

    try {
      if (!fs.existsSync(sessionPath)) {
        return m.reply(`❌ Session *${sessionNumber}* not found.`);
      }

      fs.rmdirSync(sessionPath, { recursive: true });
      m.reply(`✅ Session *${sessionNumber}* deleted successfully.`);
      process.exit(42); 

    } catch (error) {
      console.error('Error deleting session:', error);
      m.reply(`❌ Failed to delete session *${sessionNumber}*: ${error.message}`);
    }
  }
});
