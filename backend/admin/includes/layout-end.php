<?php
if (!empty($NX_PARTIAL)) {
    if (!empty($pageScript)) {
        echo $pageScript;
    }
    return;
}
?>
        </main>
    </div>
</div>

<div id="toastStack"></div>

<script src="assets/admin-app.js"></script>
<script src="assets/nexura-ui.js"></script>
<?php if (!empty($pageScript)) { echo $pageScript; } ?>
</body>
</html>
