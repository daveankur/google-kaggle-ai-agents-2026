import json
import os

def main():
    workspace_dir = "/Users/ankurdave/Desktop/Ankur 2.0/ankur 2.0/Kaggle AI Learning"
    scratch_dir = os.path.join(workspace_dir, "scratch")
    
    # Load JSON data
    json_path = os.path.join(scratch_dir, "unified_data.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Dump JSON as formatted JS object string
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    
    # Load JS functions
    funcs_path = os.path.join(scratch_dir, "unified_functions.js")
    with open(funcs_path, "r", encoding="utf-8") as f:
        funcs_str = f.read()
        
    # Construct complete script block
    compiled_js = f"""  <script>
    // Central database containing consolidated course assets
    const COURSE_DATA = {json_str};

{funcs_str}

    // Bind events
    globalSearch.addEventListener('input', handleSearch);
    document.getElementById('glossarySearch').addEventListener('input', filterGlossary);
    closeVideoBtn.addEventListener('click', closeVideo);

    // Wire tab links
    navItems.forEach(item => {{
      item.addEventListener('click', () => {{
        switchTab(item.getAttribute('data-tab'));
      }});
    }});

    window.onload = init;
  </script>"""

    # Read index.html
    html_path = os.path.join(workspace_dir, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    # Locate script tag boundaries by searching for the COURSE_DATA block
    target_marker = "const COURSE_DATA = "
    target_idx = html_content.find(target_marker)
    if target_idx == -1:
        print("Error: Could not locate COURSE_DATA definition in index.html")
        return

    # Find the nearest <script> tag opening before target_idx
    start_idx = html_content.rfind("<script>", 0, target_idx)
    if start_idx == -1:
        start_idx = html_content.rfind("  <script>", 0, target_idx)
        
    if start_idx == -1:
        print("Error: Could not locate opening <script> tag for COURSE_DATA in index.html")
        return
        
    # Find the nearest </script> tag closing after target_idx
    end_idx = html_content.find("</script>", target_idx)
    if end_idx == -1:
        end_idx = html_content.find("  </script>", target_idx)
        
    if end_idx == -1:
        print("Error: Could not locate closing </script> tag for COURSE_DATA in index.html")
        return
        
    end_marker_len = len("</script>") if html_content[end_idx:end_idx+len("</script>")] == "</script>" else len("  </script>")
    end_idx += end_marker_len
    
    # Replace block
    updated_html = html_content[:start_idx] + compiled_js + html_content[end_idx:]
    
    # Write updated HTML
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(updated_html)
        
    print(f"Successfully compiled course dashboard script into {html_path}!")

if __name__ == "__main__":
    main()
