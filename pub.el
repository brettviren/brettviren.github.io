(require 'org-publish)
(let ((default-directory "~/git/brettviren.github.com"))
  (setq bv-orgpub-topics-org-dir (expand-file-name "org/topics"))
  (setq bv-orgpub-topics-pub-dir (expand-file-name "topics"))
)
(setq org-publish-project-alist
      
      `(			       ; personal wiki jumble of stuff
	("topics"		
	 :base-extension "org"
	 :base-directory ,bv-orgpub-topics-org-dir
	 :publishing-directory ,bv-orgpub-topics-pub-dir
	 :recursive t
	 :publishing-function org-publish-org-to-html
	 :headline-levels 3
	 :auto-preamble t
	 :auto-sitemap t                
	 :sitemap-filename "sitemap.org"
	 :sitemap-title "Sitemap"       

	 )
	
	("all" :components ("topics"))
	
	))
(setq org-link-abbrev-alist
      '(
	; link to ROOT's class docs
	("tclass" . "http://root.cern.ch/root/html/%s")
	))