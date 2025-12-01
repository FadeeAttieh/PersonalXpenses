export async function showMenuNameById(menuId) {
    try {
        const response = await fetch(`/menu/name?id=${menuId}`);
        if (!response.ok) throw new Error('Menu item not found');
        const data = await response.json();
        alert(`Menu Name: ${data.name}`);
    } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
        alert('Error: ' + err.message);
    }
}

// Add other menu-related functions here as needed
export async function fetchAndRenderMenu(parentId = null, container = 'menu-items', expandedMap = {}) {
    const containerElem = typeof container === 'string' ? document.getElementById(container) : container;
    try {
        const response = await fetch('/menu?parentId=' + (parentId || ''));
        const menuItems = await response.json();
        let html = '<ul>';
        menuItems.forEach(item => {
            const hasChildren = Number(item.child_count) > 0;
            const isExpanded = expandedMap[item.id];
            html += `<li class="menu-item${hasChildren ? ' parent' : ''}${isExpanded ? ' expanded' : ''}" data-id="${item.id}">
                <img src="${item.icon || ''}" alt="" class="menu-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:8px;">
                <span class="menu-name">${item.name}</span>
                ${hasChildren ? `<span class="arrow">${isExpanded ? '▼' : '▶'}</span>` : ''}
                <div class="submenu" style="display:${isExpanded ? 'block' : 'none'}"></div>
            </li>`;
        });
        html += '</ul>';
        containerElem.innerHTML = html;

        // Attach click listeners
        containerElem.querySelectorAll('.parent').forEach(item => {
            item.addEventListener('click', async function (e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                const submenu = this.querySelector('.submenu');
                const arrow = this.querySelector('.arrow');
                const isExpanded = this.classList.contains('expanded');

                // Collapse all siblings
                this.parentElement.querySelectorAll('.parent.expanded').forEach(sibling => {
                    if (sibling !== this) {
                        sibling.classList.remove('expanded');
                        const sibArrow = sibling.querySelector('.arrow');
                        if (sibArrow) sibArrow.textContent = '▶';
                        const sibSubmenu = sibling.querySelector('.submenu');
                        if (sibSubmenu) sibSubmenu.style.display = 'none';
                    }
                });

                // Toggle current
                if (isExpanded) {
                    this.classList.remove('expanded');
                    if (arrow) arrow.textContent = '▶';
                    if (submenu) submenu.style.display = 'none';
                } else {
                    this.classList.add('expanded');
                    if (arrow) arrow.textContent = '▼';
                    if (submenu) {
                        submenu.style.display = 'block';
                        submenu.innerHTML = '<div style="padding:8px;color:#888;">Loading...</div>';
                        // Fetch and render children
                        const resp = await fetch('/menu?parentId=' + id);
                        const children = await resp.json();
                        let childHtml = '<ul>';
                        children.forEach(child => {
                            const hasSubChildren = Number(child.child_count) > 0;
                            childHtml += `<li class="menu-item${hasSubChildren ? ' parent' : ''}" data-id="${child.id}">
                                <img src="${child.icon || ''}" alt="" class="menu-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:8px;">
                                <span class="menu-name">${child.name}</span>
                                ${hasSubChildren ? `<span class="arrow">▶</span>` : ''}
                                <div class="submenu" style="display:none"></div>
                            </li>`;
                        });
                        childHtml += '</ul>';
                        submenu.innerHTML = childHtml;

                        // Recursively attach listeners to children
                        submenu.querySelectorAll('.parent').forEach(childItem => {
                            childItem.addEventListener('click', function (e) {
                                e.stopPropagation();
                                // Collapse siblings at this level
                                childItem.parentElement.querySelectorAll('.parent.expanded').forEach(sibling => {
                                    if (sibling !== childItem) {
                                        sibling.classList.remove('expanded');
                                        const sibArrow = sibling.querySelector('.arrow');
                                        if (sibArrow) sibArrow.textContent = '▶';
                                        const sibSubmenu = sibling.querySelector('.submenu');
                                        if (sibSubmenu) sibSubmenu.style.display = 'none';
                                    }
                                });
                                // Toggle this child
                                const childArrow = childItem.querySelector('.arrow');
                                const childSubmenu = childItem.querySelector('.submenu');
                                const isChildExpanded = childItem.classList.contains('expanded');
                                if (isChildExpanded) {
                                    childItem.classList.remove('expanded');
                                    if (childArrow) childArrow.textContent = '▶';
                                    if (childSubmenu) childSubmenu.style.display = 'none';
                                } else {
                                    childItem.classList.add('expanded');
                                    if (childArrow) childArrow.textContent = '▼';
                                    if (childSubmenu) {
                                        childSubmenu.style.display = 'block';
                                        childSubmenu.innerHTML = '<div style="padding:8px;color:#888;">Loading...</div>';
                                        // Fetch and render subchildren into the submenu DOM element
                                        fetchAndRenderMenu(childItem.getAttribute('data-id'), childSubmenu, {});
                                    }
                                }
                            });
                        });
                    }
                }
            });
        });
    } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
        containerElem.innerHTML = '<p>Error loading menu.</p>';
    }
}