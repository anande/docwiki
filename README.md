Pushing to multiple documentation repos at once using mkdocs command:

```

(venv) user@localhost docwiki % git remote -v
origin  https://github.com/anande/docwiki.git (fetch)
origin  https://github.com/anande/docwiki.git (push)


(venv) user@localhost docwiki % git remote set-url --add --push origin git@github.com:cloudblogs/docwiki.git    
(venv) user@localhost docwiki % git remote add cloudblogs git@github.com:cloudblogs/docwiki.git
(venv) user@localhost docwiki % git remote set-url --add --push origin git@github.com:anande/docwiki.git    
(venv) user@localhost docwiki % git remote add gh git@github.com:anande/docwiki.git    

                 
(venv) user@localhost docwiki % git remote -v
gh      git@github.com:anande/docwiki.git (fetch)
gh      git@github.com:anande/docwiki.git (push)
origin  https://github.com/anande/docwiki.git (fetch)
origin  git@github.com:cloudblogs/docwiki.git (push)
origin  git@github.com:anande/docwiki.git (push)
cloudblogs      git@github.com:cloudblogs/docwiki.git (fetch)
cloudblogs      git@github.com:cloudblogs/docwiki.git (push)


(venv) user@localhost docwiki % mkdocs gh-deploy --remote-name gh


(venv) user@localhost docwiki % mkdocs gh-deploy --remote-name cloudblogs



(venv) user@localhost docwiki % history |tail -2
1332  mkdocs gh-deploy --remote-name gh
1333  mkdocs gh-deploy --remote-name cloudblogs


(venv) user@localhost docwiki % vim /usr/local/bin/mkdocs_push
(venv) user@localhost docwiki % chmod +x /usr/local/bin/mkdocs_push

(venv) user@localhost docwiki % mkdocs_push
```
