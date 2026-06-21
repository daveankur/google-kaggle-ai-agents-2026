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
        
    # Locate script tag boundaries
    # We look for the last script block starting with <script> and ending with </script>
    start_marker = "  <script>"
    end_marker = "  </script>"
    
    start_idx = html_content.find(start_marker)
    if start_idx == -1:
        # Fallback to search for '<script>' without leading spaces
        start_marker = "<script>"
        start_idx = html_content.find(start_marker)
        
    if start_idx == -1:
        print("Error: Could not locate <script> tag in index.html")
        return
        
    end_idx = html_content.find(end_marker, start_idx)
    if end_idx == -1:
        end_marker = "</script>"
        end_idx = html_content.find(end_marker, start_idx)
        
    if end_idx == -1:
        print("Error: Could not locate </script> tag in index.html")
        return
        
    end_idx += len(end_marker)
    
    # Replace block
    updated_html = html_content[:start_idx] + compiled_js + html_content[end_idx:]
    
    # Write updated HTML
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(updated_html)
        
    print(f"Successfully compiled course dashboard script into {html_path}!")

if __name__ == "__main__":
    main()
